/**
 * @fileoverview replace lodash map to native
 * @author Adamov A.
 */

module.exports = {
    meta: {
        type: "suggestion",
        messages: {
            avoidName: "Avoid usein lodash map insteed native map"
        },
        docs: {
            description: "replace lodash map to native",
        },
        fixable: 'code',
    },

    create: function (context) {


        function isMapFromLodash(callee) {
            return callee.object.name === "_" && callee.property.name === "map";
        }

        function isLiteralArray(arguments) {
            return arguments[0].type === 'ArrayExpression';
        }

        function isArray(arrayIdentifiers) {
            return Array.isArray(arrayIdentifiers[0].identifiers[0].range)
        }




        return {
            ExpressionStatement(node) {
                const { expression } = node;
                const { callee, arguments } = expression;

                const sourceCode = context.getSourceCode();
                const firstArgument = sourceCode.getText(arguments[0]); // первый аргумент переданный в метод
                const secondArgument = sourceCode.getText(arguments[1]);  // второй аргумент переданный в метод

                if (isMapFromLodash(callee)) {
                    if (isLiteralArray(arguments)) {
                        const shortAnswer = `${firstArgument}.map(${secondArgument})`;

                        context.report({
                            node,
                            messageId: "avoidName",
                            suggest: [
                                {
                                    desc: "replace lodash map to native",
                                    fix(fixer) {
                                        return fixer.replaceText(node, shortAnswer);
                                    }
                                }
                            ],
                        });

                    } else if (arguments[0].type === 'Identifier') {
                        const arrayIdentifiers = context.getScope().variables.filter(v => v.name === arguments[0].name); // массив на который ссылаетя переменная 

                        if (isArray(arrayIdentifiers)) {
                            const longAnswer = `Array.isArray(${firstArgument}) ? ${firstArgument}.map(${secondArgument}) : _.map(${firstArgument}, ${secondArgument});`;

                            context.report({
                                node,
                                messageId: "avoidName",
                                suggest: [
                                    {
                                        desc: "replace lodash map to native",
                                        fix(fixer) {
                                            return fixer.replaceText(node, longAnswer);
                                        }
                                    }
                                ],
                            });
                        }
                    }
                }

            }
        };
    }
};
