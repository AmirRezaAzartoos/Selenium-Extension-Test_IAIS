let DOMPath;
(function() {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a }
                var p = n[i] = { exports: {} };
                e[i][0].call(p.exports, function(r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t)
            }
            return n[i].exports
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o
    }
    return r
})()({
    1: [function(require, module, exports) {

    }, {}],
    2: [function(require, module, exports) {
        module.exports.nodeNameInCorrectCase = function nodeNameInCorrectCase(node) {
            const shadowRootType = node.shadowRoot && node.shadowRoot.mode;
            if (shadowRootType)
                return '#shadow-root (' + shadowRootType + ')';

            // If there is no local name, it's case sensitive
            if (!node.localName)
                return node.nodeName;

            // If the names are different lengths, there is a prefix and it's case sensitive
            if (node.localName.length !== node.nodeName.length)
                return node.nodeName;

            // Return the localname, which will be case insensitive if its an html node
            return node.localName;
        }

        module.exports.shadowRootType = function(node) {
            const ancestorShadowRoot = node.ancestorShadowRoot();
            return ancestorShadowRoot ? ancestorShadowRoot.mode : null;
        }

        module.exports.NodeType = {
            ELEMENT_NODE: 1,
            ATTRIBUTE_NODE: 2,
            TEXT_NODE: 3,
            CDATA_SECTION_NODE: 4,
            PROCESSING_INSTRUCTION_NODE: 7,
            COMMENT_NODE: 8,
            DOCUMENT_NODE: 9
        }
        module.exports.ShadowRootTypes = {
            UserAgent: 'user-agent',
            Open: 'open',
            Closed: 'closed'
        };

    }, {}],
    3: [function(require, module, exports) {
        // This file taken from the ChromeDevTools repository and modified by rannn505 to make it work on JSDOM.
        // https://github.com/ChromeDevTools/devtools-frontend/blob/6b5621bb7709854a4697b3aa794822c5898f4d09/front_end/elements/DOMPath.js

        // Copyright 2018 The Chromium Authors. All rights reserved.
        // Use of this source code is governed by a BSD-style license that can be
        // found in the LICENSE file.

        require('css.escape');
        const { ShadowRootTypes, nodeNameInCorrectCase, NodeType } = require('./DOMNode');

        let Elements = {};
        Elements.DOMPath = {};

        /**
         * @param {!SDK.DOMNode} node
         * @param {boolean=} justSelector
         * @return {string}
         */
        Elements.DOMPath.fullQualifiedSelector = function(node, justSelector) {
            try {
                if (node.nodeType !== NodeType.ELEMENT_NODE)
                    return node.localName || node.nodeName.toLowerCase();
                return Elements.DOMPath.cssPath(node, justSelector);
            } catch (e) {
                return null;
            }
        };

        /**
         * @param {!SDK.DOMNode} node
         * @param {boolean=} optimized
         * @return {string}
         */
        Elements.DOMPath.cssPath = function(node, optimized) {
            if (node.nodeType !== NodeType.ELEMENT_NODE)
                return '';

            const steps = [];
            let contextNode = node;
            while (contextNode) {
                const step = Elements.DOMPath._cssPathStep(contextNode, !!optimized, contextNode === node);
                if (!step)
                    break; // Error - bail out early.
                steps.push(step);
                if (step.optimized)
                    break;
                contextNode = contextNode.parentNode;
            }

            steps.reverse();
            return steps.join('>');
        };

        /**
         * @param {!SDK.DOMNode} node
         * @return {boolean}
         */
        Elements.DOMPath.canGetJSPath = function(node) {
            let wp = node;
            while (wp) {
                if (wp.shadowRoot && wp.shadowRoot.mode !== ShadowRootTypes.Open)
                    return false;
                wp = wp.shadowRoot && wp.shadowRoot.host;
            }
            return true;
        };

        /**
         * @param {!SDK.DOMNode} node
         * @param {boolean=} optimized
         * @return {string}
         */
        Elements.DOMPath.jsPath = function(node, optimized) {
            if (node.nodeType !== NodeType.ELEMENT_NODE)
                return '';

            const path = [];
            let wp = node;
            while (wp) {
                path.push(Elements.DOMPath.cssPath(wp, optimized));
                wp = wp.shadowRoot && wp.shadowRoot.host;
            }
            path.reverse();
            let result = '';
            for (let i = 0; i < path.length; ++i) {
                const string = JSON.stringify(path[i]);
                if (i)
                    result += `.shadowRoot.querySelector(${string})`;
                else
                    result += `document.querySelector(${string})`;
            }
            return result;
        };

        /**
         * @param {!SDK.DOMNode} node
         * @param {boolean} optimized
         * @param {boolean} isTargetNode
         * @return {?Elements.DOMPath.Step}
         */
        Elements.DOMPath._cssPathStep = function(node, optimized, isTargetNode) {
            if (node.nodeType !== NodeType.ELEMENT_NODE)
                return null;

            const id = node.getAttribute('id');
            if (optimized) {
                if (id)
                    return new Elements.DOMPath.Step(idSelector(id), true);
                const nodeNameLower = node.nodeName.toLowerCase();
                if (nodeNameLower === 'body' || nodeNameLower === 'head' || nodeNameLower === 'html')
                    return new Elements.DOMPath.Step(nodeNameInCorrectCase(node), true);
            }
            const nodeName = nodeNameInCorrectCase(node);

            if (id)
                return new Elements.DOMPath.Step(nodeName + idSelector(id), true);
            const parent = node.parentNode;
            if (!parent || parent.nodeType === NodeType.DOCUMENT_NODE)
                return new Elements.DOMPath.Step(nodeName, true);

            /**
             * @param {!SDK.DOMNode} node
             * @return {!Array.<string>}
             */
            function prefixedElementClassNames(node) {
                const classAttribute = node.getAttribute('class');
                if (!classAttribute)
                    return [];

                return classAttribute.split(/\s+/g).filter(Boolean).map(function(name) {
                    // The prefix is required to store "__proto__" in a object-based map.
                    return '$' + name;
                });
            }

            /**
             * @param {string} id
             * @return {string}
             */
            function idSelector(id) {
                return '#' + CSS.escape(id);
            }

            const prefixedOwnClassNamesArray = prefixedElementClassNames(node);
            let needsClassNames = false;
            let needsNthChild = false;
            let ownIndex = -1;
            let elementIndex = -1;
            const siblings = parent.children;
            for (let i = 0;
                (ownIndex === -1 || !needsNthChild) && i < siblings.length; ++i) {
                const sibling = siblings[i];
                if (sibling.nodeType !== NodeType.ELEMENT_NODE)
                    continue;
                elementIndex += 1;
                if (sibling === node) {
                    ownIndex = elementIndex;
                    continue;
                }
                if (needsNthChild)
                    continue;
                if (nodeNameInCorrectCase(sibling) !== nodeName)
                    continue;

                needsClassNames = true;
                const ownClassNames = new Set(prefixedOwnClassNamesArray);
                if (!ownClassNames.size) {
                    needsNthChild = true;
                    continue;
                }
                const siblingClassNamesArray = prefixedElementClassNames(sibling);
                for (let j = 0; j < siblingClassNamesArray.length; ++j) {
                    const siblingClass = siblingClassNamesArray[j];
                    if (!ownClassNames.has(siblingClass))
                        continue;
                    ownClassNames.delete(siblingClass);
                    if (!ownClassNames.size) {
                        needsNthChild = true;
                        break;
                    }
                }
            }

            let result = nodeName;
            if (isTargetNode && nodeName.toLowerCase() === 'input' && node.getAttribute('type') && !node.getAttribute('id') &&
                !node.getAttribute('class'))
                result += '[type=' + CSS.escape(node.getAttribute('type')) + ']';
            if (needsNthChild) {
                result += ':nth-child(' + (ownIndex + 1) + ')';
            } else if (needsClassNames) {
                for (const prefixedName of prefixedOwnClassNamesArray)
                    result += '.' + CSS.escape(prefixedName.slice(1));
            }

            return new Elements.DOMPath.Step(result, false);
        };

        /**
         * @param {!SDK.DOMNode} node
         * @param {boolean=} optimized
         * @return {string}
         */
        Elements.DOMPath.xPath = function(node, optimized) {
            if (node.nodeType === NodeType.DOCUMENT_NODE)
                return '/';

            const steps = [];
            let contextNode = node;
            while (contextNode) {
                const step = Elements.DOMPath._xPathValue(contextNode, optimized);
                if (!step)
                    break; // Error - bail out early.
                steps.push(step);
                if (step.optimized)
                    break;
                contextNode = contextNode.parentNode;
            }

            steps.reverse();
            return (steps.length && steps[0].optimized ? '' : '/') + steps.join('/');
        };

        /**
         * @param {!SDK.DOMNode} node
         * @param {boolean=} optimized
         * @return {?Elements.DOMPath.Step}
         */
        Elements.DOMPath._xPathValue = function(node, optimized) {
            let ownValue;
            const ownIndex = Elements.DOMPath._xPathIndex(node);
            if (ownIndex === -1)
                return null; // Error.

            switch (node.nodeType) {
                case NodeType.ELEMENT_NODE:
                    if (optimized && node.getAttribute('id'))
                        return new Elements.DOMPath.Step('//*[@id="' + node.getAttribute('id') + '"]', true);
                    ownValue = node.localName;
                    break;
                case NodeType.ATTRIBUTE_NODE:
                    ownValue = '@' + node.nodeName;
                    break;
                case NodeType.TEXT_NODE:
                case NodeType.CDATA_SECTION_NODE:
                    ownValue = 'text()';
                    break;
                case NodeType.PROCESSING_INSTRUCTION_NODE:
                    ownValue = 'processing-instruction()';
                    break;
                case NodeType.COMMENT_NODE:
                    ownValue = 'comment()';
                    break;
                case NodeType.DOCUMENT_NODE:
                    ownValue = '';
                    break;
                default:
                    ownValue = '';
                    break;
            }

            if (ownIndex > 0)
                ownValue += '[' + ownIndex + ']';

            return new Elements.DOMPath.Step(ownValue, node.nodeType === NodeType.DOCUMENT_NODE);
        };

        /**
         * @param {!SDK.DOMNode} node
         * @return {number}
         */
        Elements.DOMPath._xPathIndex = function(node) {
            // Returns -1 in case of error, 0 if no siblings matching the same expression, <XPath index among the same expression-matching sibling nodes> otherwise.
            function areNodesSimilar(left, right) {
                if (left === right)
                    return true;

                if (left.nodeType === NodeType.ELEMENT_NODE && right.nodeType === NodeType.ELEMENT_NODE)
                    return left.localName === right.localName;

                if (left.nodeType === right.nodeType)
                    return true;

                // XPath treats CDATA as text nodes.
                const leftType = left.nodeType === NodeType.CDATA_SECTION_NODE ? NodeType.TEXT_NODE : left.nodeType;
                const rightType = right.nodeType === NodeType.CDATA_SECTION_NODE ? NodeType.TEXT_NODE : right.nodeType;
                return leftType === rightType;
            }

            const siblings = node.parentNode ? node.parentNode.children : null;
            if (!siblings)
                return 0; // Root node - no siblings.
            let hasSameNamedElements;
            for (let i = 0; i < siblings.length; ++i) {
                if (areNodesSimilar(node, siblings[i]) && siblings[i] !== node) {
                    hasSameNamedElements = true;
                    break;
                }
            }
            if (!hasSameNamedElements)
                return 0;
            let ownIndex = 1; // XPath indices start with 1.
            for (let i = 0; i < siblings.length; ++i) {
                if (areNodesSimilar(node, siblings[i])) {
                    if (siblings[i] === node)
                        return ownIndex;
                    ++ownIndex;
                }
            }
            return -1; // An error occurred: |node| not found in parent's children.
        };

        /**
         * @unrestricted
         */
        Elements.DOMPath.Step = class {
            /**
             * @param {string} value
             * @param {boolean} optimized
             */
            constructor(value, optimized) {
                this.value = value;
                this.optimized = optimized || false;
            }

            /**
             * @override
             * @return {string}
             */
            toString() {
                return this.value;
            }
        };

        module.exports = Elements.DOMPath;

    }, { "./DOMNode": 2, "css.escape": 1 }],
    4: [function(require, module, exports) {
        (function(global) {
            (function() {
                /*! https://mths.be/cssescape v1.5.1 by @mathias | MIT license */
                ;
                (function(root, factory) {
                    // https://github.com/umdjs/umd/blob/master/returnExports.js
                    if (typeof exports == 'object') {
                        // For Node.js.
                        module.exports = factory(root);
                    } else if (typeof define == 'function' && define.amd) {
                        // For AMD. Register as an anonymous module.
                        define([], factory.bind(root, root));
                    } else {
                        // For browser globals (not exposing the function separately).
                        factory(root);
                    }
                }(typeof global != 'undefined' ? global : this, function(root) {

                    if (root.CSS && root.CSS.escape) {
                        return root.CSS.escape;
                    }

                    // https://drafts.csswg.org/cssom/#serialize-an-identifier
                    var cssEscape = function(value) {
                        if (arguments.length == 0) {
                            throw new TypeError('`CSS.escape` requires an argument.');
                        }
                        var string = String(value);
                        var length = string.length;
                        var index = -1;
                        var codeUnit;
                        var result = '';
                        var firstCodeUnit = string.charCodeAt(0);
                        while (++index < length) {
                            codeUnit = string.charCodeAt(index);
                            // Note: there’s no need to special-case astral symbols, surrogate
                            // pairs, or lone surrogates.

                            // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
                            // (U+FFFD).
                            if (codeUnit == 0x0000) {
                                result += '\uFFFD';
                                continue;
                            }

                            if (
                                // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
                                // U+007F, […]
                                (codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
                                // If the character is the first character and is in the range [0-9]
                                // (U+0030 to U+0039), […]
                                (index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
                                // If the character is the second character and is in the range [0-9]
                                // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
                                (
                                    index == 1 &&
                                    codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
                                    firstCodeUnit == 0x002D
                                )
                            ) {
                                // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
                                result += '\\' + codeUnit.toString(16) + ' ';
                                continue;
                            }

                            if (
                                // If the character is the first character and is a `-` (U+002D), and
                                // there is no second character, […]
                                index == 0 &&
                                length == 1 &&
                                codeUnit == 0x002D
                            ) {
                                result += '\\' + string.charAt(index);
                                continue;
                            }

                            // If the character is not handled by one of the above rules and is
                            // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
                            // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
                            // U+005A), or [a-z] (U+0061 to U+007A), […]
                            if (
                                codeUnit >= 0x0080 ||
                                codeUnit == 0x002D ||
                                codeUnit == 0x005F ||
                                codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
                                codeUnit >= 0x0041 && codeUnit <= 0x005A ||
                                codeUnit >= 0x0061 && codeUnit <= 0x007A
                            ) {
                                // the character itself
                                result += string.charAt(index);
                                continue;
                            }

                            // Otherwise, the escaped character.
                            // https://drafts.csswg.org/cssom/#escape-a-character
                            result += '\\' + string.charAt(index);

                        }
                        return result;
                    };

                    if (!root.CSS) {
                        root.CSS = {};
                    }

                    root.CSS.escape = cssEscape;
                    return cssEscape;

                }));

            }).call(this)
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}],
    5: [function(require, module, exports) {
        arguments[4][2][0].apply(exports, arguments)
    }, { "dup": 2 }],
    6: [function(require, module, exports) {
        (function() {
            function r(e, n, t) {
                function o(i, f) {
                    if (!n[i]) {
                        if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a }
                        var p = n[i] = { exports: {} };
                        e[i][0].call(p.exports, function(r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t)
                    }
                    return n[i].exports
                }
                for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
                return o
            }
            return r
        })()({
            1: [function(require, module, exports) {

            }, {}],
            2: [function(require, module, exports) {
                module.exports.nodeNameInCorrectCase = function nodeNameInCorrectCase(node) {
                    const shadowRootType = node.shadowRoot && node.shadowRoot.mode;
                    if (shadowRootType)
                        return '#shadow-root (' + shadowRootType + ')';

                    // If there is no local name, it's case sensitive
                    if (!node.localName)
                        return node.nodeName;

                    // If the names are different lengths, there is a prefix and it's case sensitive
                    if (node.localName.length !== node.nodeName.length)
                        return node.nodeName;

                    // Return the localname, which will be case insensitive if its an html node
                    return node.localName;
                }

                module.exports.shadowRootType = function(node) {
                    const ancestorShadowRoot = node.ancestorShadowRoot();
                    return ancestorShadowRoot ? ancestorShadowRoot.mode : null;
                }

                module.exports.NodeType = {
                    ELEMENT_NODE: 1,
                    ATTRIBUTE_NODE: 2,
                    TEXT_NODE: 3,
                    CDATA_SECTION_NODE: 4,
                    PROCESSING_INSTRUCTION_NODE: 7,
                    COMMENT_NODE: 8,
                    DOCUMENT_NODE: 9
                }
                module.exports.ShadowRootTypes = {
                    UserAgent: 'user-agent',
                    Open: 'open',
                    Closed: 'closed'
                };

            }, {}],
            3: [function(require, module, exports) {
                // This file taken from the ChromeDevTools repository and modified by rannn505 to make it work on JSDOM.
                // https://github.com/ChromeDevTools/devtools-frontend/blob/6b5621bb7709854a4697b3aa794822c5898f4d09/front_end/elements/DOMPath.js

                // Copyright 2018 The Chromium Authors. All rights reserved.
                // Use of this source code is governed by a BSD-style license that can be
                // found in the LICENSE file.

                require('css.escape');
                const { ShadowRootTypes, nodeNameInCorrectCase, NodeType } = require('./DOMNode');

                let Elements = {};
                Elements.DOMPath = {};

                /**
                 * @param {!SDK.DOMNode} node
                 * @param {boolean=} justSelector
                 * @return {string}
                 */
                Elements.DOMPath.fullQualifiedSelector = function(node, justSelector) {
                    try {
                        if (node.nodeType !== NodeType.ELEMENT_NODE)
                            return node.localName || node.nodeName.toLowerCase();
                        return Elements.DOMPath.cssPath(node, justSelector);
                    } catch (e) {
                        return null;
                    }
                };

                /**
                 * @param {!SDK.DOMNode} node
                 * @param {boolean=} optimized
                 * @return {string}
                 */
                Elements.DOMPath.cssPath = function(node, optimized) {
                    if (node.nodeType !== NodeType.ELEMENT_NODE)
                        return '';

                    const steps = [];
                    let contextNode = node;
                    while (contextNode) {
                        const step = Elements.DOMPath._cssPathStep(contextNode, !!optimized, contextNode === node);
                        if (!step)
                            break; // Error - bail out early.
                        steps.push(step);
                        if (step.optimized)
                            break;
                        contextNode = contextNode.parentNode;
                    }

                    steps.reverse();
                    return steps.join('>');
                };

                /**
                 * @param {!SDK.DOMNode} node
                 * @return {boolean}
                 */
                Elements.DOMPath.canGetJSPath = function(node) {
                    let wp = node;
                    while (wp) {
                        if (wp.shadowRoot && wp.shadowRoot.mode !== ShadowRootTypes.Open)
                            return false;
                        wp = wp.shadowRoot && wp.shadowRoot.host;
                    }
                    return true;
                };

                /**
                 * @param {!SDK.DOMNode} node
                 * @param {boolean=} optimized
                 * @return {string}
                 */
                Elements.DOMPath.jsPath = function(node, optimized) {
                    if (node.nodeType !== NodeType.ELEMENT_NODE)
                        return '';

                    const path = [];
                    let wp = node;
                    while (wp) {
                        path.push(Elements.DOMPath.cssPath(wp, optimized));
                        wp = wp.shadowRoot && wp.shadowRoot.host;
                    }
                    path.reverse();
                    let result = '';
                    for (let i = 0; i < path.length; ++i) {
                        const string = JSON.stringify(path[i]);
                        if (i)
                            result += `.shadowRoot.querySelector(${string})`;
                        else
                            result += `document.querySelector(${string})`;
                    }
                    return result;
                };

                /**
                 * @param {!SDK.DOMNode} node
                 * @param {boolean} optimized
                 * @param {boolean} isTargetNode
                 * @return {?Elements.DOMPath.Step}
                 */
                Elements.DOMPath._cssPathStep = function(node, optimized, isTargetNode) {
                    if (node.nodeType !== NodeType.ELEMENT_NODE)
                        return null;

                    const id = node.getAttribute('id');
                    if (optimized) {
                        if (id)
                            return new Elements.DOMPath.Step(idSelector(id), true);
                        const nodeNameLower = node.nodeName.toLowerCase();
                        if (nodeNameLower === 'body' || nodeNameLower === 'head' || nodeNameLower === 'html')
                            return new Elements.DOMPath.Step(nodeNameInCorrectCase(node), true);
                    }
                    const nodeName = nodeNameInCorrectCase(node);

                    if (id)
                        return new Elements.DOMPath.Step(nodeName + idSelector(id), true);
                    const parent = node.parentNode;
                    if (!parent || parent.nodeType === NodeType.DOCUMENT_NODE)
                        return new Elements.DOMPath.Step(nodeName, true);

                    /**
                     * @param {!SDK.DOMNode} node
                     * @return {!Array.<string>}
                     */
                    function prefixedElementClassNames(node) {
                        const classAttribute = node.getAttribute('class');
                        if (!classAttribute)
                            return [];

                        return classAttribute.split(/\s+/g).filter(Boolean).map(function(name) {
                            // The prefix is required to store "__proto__" in a object-based map.
                            return '$' + name;
                        });
                    }

                    /**
                     * @param {string} id
                     * @return {string}
                     */
                    function idSelector(id) {
                        return '#' + CSS.escape(id);
                    }

                    const prefixedOwnClassNamesArray = prefixedElementClassNames(node);
                    let needsClassNames = false;
                    let needsNthChild = false;
                    let ownIndex = -1;
                    let elementIndex = -1;
                    const siblings = parent.children;
                    for (let i = 0;
                        (ownIndex === -1 || !needsNthChild) && i < siblings.length; ++i) {
                        const sibling = siblings[i];
                        if (sibling.nodeType !== NodeType.ELEMENT_NODE)
                            continue;
                        elementIndex += 1;
                        if (sibling === node) {
                            ownIndex = elementIndex;
                            continue;
                        }
                        if (needsNthChild)
                            continue;
                        if (nodeNameInCorrectCase(sibling) !== nodeName)
                            continue;

                        needsClassNames = true;
                        const ownClassNames = new Set(prefixedOwnClassNamesArray);
                        if (!ownClassNames.size) {
                            needsNthChild = true;
                            continue;
                        }
                        const siblingClassNamesArray = prefixedElementClassNames(sibling);
                        for (let j = 0; j < siblingClassNamesArray.length; ++j) {
                            const siblingClass = siblingClassNamesArray[j];
                            if (!ownClassNames.has(siblingClass))
                                continue;
                            ownClassNames.delete(siblingClass);
                            if (!ownClassNames.size) {
                                needsNthChild = true;
                                break;
                            }
                        }
                    }

                    let result = nodeName;
                    if (isTargetNode && nodeName.toLowerCase() === 'input' && node.getAttribute('type') && !node.getAttribute('id') &&
                        !node.getAttribute('class'))
                        result += '[type=' + CSS.escape(node.getAttribute('type')) + ']';
                    if (needsNthChild) {
                        result += ':nth-child(' + (ownIndex + 1) + ')';
                    } else if (needsClassNames) {
                        for (const prefixedName of prefixedOwnClassNamesArray)
                            result += '.' + CSS.escape(prefixedName.slice(1));
                    }

                    return new Elements.DOMPath.Step(result, false);
                };

                /**
                 * @param {!SDK.DOMNode} node
                 * @param {boolean=} optimized
                 * @return {string}
                 */
                Elements.DOMPath.xPath = function(node, optimized) {
                    if (node.nodeType === NodeType.DOCUMENT_NODE)
                        return '/';

                    const steps = [];
                    let contextNode = node;
                    while (contextNode) {
                        const step = Elements.DOMPath._xPathValue(contextNode, optimized);
                        if (!step)
                            break; // Error - bail out early.
                        steps.push(step);
                        if (step.optimized)
                            break;
                        contextNode = contextNode.parentNode;
                    }

                    steps.reverse();
                    return (steps.length && steps[0].optimized ? '' : '/') + steps.join('/');
                };

                /**
                 * @param {!SDK.DOMNode} node
                 * @param {boolean=} optimized
                 * @return {?Elements.DOMPath.Step}
                 */
                Elements.DOMPath._xPathValue = function(node, optimized) {
                    let ownValue;
                    const ownIndex = Elements.DOMPath._xPathIndex(node);
                    if (ownIndex === -1)
                        return null; // Error.

                    switch (node.nodeType) {
                        case NodeType.ELEMENT_NODE:
                            if (optimized && node.getAttribute('id'))
                                return new Elements.DOMPath.Step('//*[@id="' + node.getAttribute('id') + '"]', true);
                            ownValue = node.localName;
                            break;
                        case NodeType.ATTRIBUTE_NODE:
                            ownValue = '@' + node.nodeName;
                            break;
                        case NodeType.TEXT_NODE:
                        case NodeType.CDATA_SECTION_NODE:
                            ownValue = 'text()';
                            break;
                        case NodeType.PROCESSING_INSTRUCTION_NODE:
                            ownValue = 'processing-instruction()';
                            break;
                        case NodeType.COMMENT_NODE:
                            ownValue = 'comment()';
                            break;
                        case NodeType.DOCUMENT_NODE:
                            ownValue = '';
                            break;
                        default:
                            ownValue = '';
                            break;
                    }

                    if (ownIndex > 0)
                        ownValue += '[' + ownIndex + ']';

                    return new Elements.DOMPath.Step(ownValue, node.nodeType === NodeType.DOCUMENT_NODE);
                };

                /**
                 * @param {!SDK.DOMNode} node
                 * @return {number}
                 */
                Elements.DOMPath._xPathIndex = function(node) {
                    // Returns -1 in case of error, 0 if no siblings matching the same expression, <XPath index among the same expression-matching sibling nodes> otherwise.
                    function areNodesSimilar(left, right) {
                        if (left === right)
                            return true;

                        if (left.nodeType === NodeType.ELEMENT_NODE && right.nodeType === NodeType.ELEMENT_NODE)
                            return left.localName === right.localName;

                        if (left.nodeType === right.nodeType)
                            return true;

                        // XPath treats CDATA as text nodes.
                        const leftType = left.nodeType === NodeType.CDATA_SECTION_NODE ? NodeType.TEXT_NODE : left.nodeType;
                        const rightType = right.nodeType === NodeType.CDATA_SECTION_NODE ? NodeType.TEXT_NODE : right.nodeType;
                        return leftType === rightType;
                    }

                    const siblings = node.parentNode ? node.parentNode.children : null;
                    if (!siblings)
                        return 0; // Root node - no siblings.
                    let hasSameNamedElements;
                    for (let i = 0; i < siblings.length; ++i) {
                        if (areNodesSimilar(node, siblings[i]) && siblings[i] !== node) {
                            hasSameNamedElements = true;
                            break;
                        }
                    }
                    if (!hasSameNamedElements)
                        return 0;
                    let ownIndex = 1; // XPath indices start with 1.
                    for (let i = 0; i < siblings.length; ++i) {
                        if (areNodesSimilar(node, siblings[i])) {
                            if (siblings[i] === node)
                                return ownIndex;
                            ++ownIndex;
                        }
                    }
                    return -1; // An error occurred: |node| not found in parent's children.
                };

                /**
                 * @unrestricted
                 */
                Elements.DOMPath.Step = class {
                    /**
                     * @param {string} value
                     * @param {boolean} optimized
                     */
                    constructor(value, optimized) {
                        this.value = value;
                        this.optimized = optimized || false;
                    }

                    /**
                     * @override
                     * @return {string}
                     */
                    toString() {
                        return this.value;
                    }
                };

                module.exports = Elements.DOMPath;

            }, { "./DOMNode": 2, "css.escape": 1 }],
            4: [function(require, module, exports) {
                DOMPath = require('chrome-dompath');

                // Browser
                /*const element = window.document.querySelector('#cart-button');
                console.log(element)
                DOMPath.fullQualifiedSelector(element, true);
                DOMPath.jsPath(element, true);
                DOMPath.xPath(element, true);
                console.log(DOMPath.xPath(element, true))*/
            }, { "chrome-dompath": 3 }]
        }, {}, [4]);
    }, { "./DOMNode": 5, "chrome-dompath": 3, "css.escape": 4 }]
}, {}, [6]);