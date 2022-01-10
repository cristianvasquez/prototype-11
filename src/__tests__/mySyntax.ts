import {getTriples} from "../lib/mySyntax";
import {Triple, TermKind} from "../types";
import {DateTime} from "luxon";

// TODO
// What's the prettiest way of specifying more than one subject?

test("simple", () => {
    const content = `
spec :: values are separated by double colons
`;
    const result: Array<Triple> = [
        {
            predicate: {
                value: 'spec'
            },
            object: {
                value: 'values are separated by double colons'
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});
//
test("specify subjects", () => {
    const content = `
subject :: ( predicate :: object ) 
`;
    const result: Array<Triple> = [
        {
            subject: {
                value: 'subject'
            },
            predicate: {
                value: 'predicate'
            },
            object: {
                value: 'object'
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});


test("multiline", () => {
    const content = `
to simplify things, this
mini-syntax :: spans
only one line
            `;
    const result: Array<Triple> = [
        {
            predicate: {
                value: 'mini-syntax'
            },
            object: {
                value: 'spans'
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});

test("arrays", () => {
    const content = `
values can can also be arrays
property :: [something, something else]
            `;
    const result: Array<Triple> = [
        {
            predicate: {
                value: 'property'
            },
            object: {
                type: TermKind.Array,
                value: [
                    {
                        "value": "something"
                    },
                    {
                        "value": "something else"
                    }
                ]
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});

test("internal links", () => {
    const content = `
property :: [[internal]]
            `;
    const result: Array<Triple> = [
        {
            predicate: {
                value: 'property'
            },
            object: {
                type: TermKind.InternalLink,
                value: '[[internal]]'
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});

test("external links", () => {
    const content = `
external link :: <http://example.org>
            `;
    const result: Array<Triple> = [
        {
            predicate: {
                value: 'external link'
            },
            object: {
                type: TermKind.ExternalLink,
                value: '<http://example.org>'
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});

test("dates", () => {
    const content = `
date :: 2022-01-07 15:07
            `;
    const result: Array<Triple> = [
        {
            predicate: {
                value: 'date'
            },
            object: {
                type: TermKind.LiteralDate,
                value: DateTime.fromSQL('2022-01-07 15:07')
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});

test("tags", () => {
    const content = `
tag :: #tag
            `;
    const result: Array<Triple> = [
        {
            predicate: {
                value: 'tag'
            },
            object: {
                type: TermKind.Tag,
                value: '#tag'
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});

test("parenthesis", () => {
    const content = `
Values can be (embedded :: using parenthesis),
            `;
    const result: Array<Triple> = [
        {
            predicate: {
                value: 'embedded'
            },
            object: {
                value: 'using parenthesis'
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});

test("parenthesis-2", () => {
    const content = `
Text (subject :: (predicate :: object)),
            `;
    const result: Array<Triple> = [
        {
            subject: {
                value: 'subject'
            },
            predicate: {
                value: 'predicate'
            },
            object: {
                value: 'object'
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});
test("parenthesis-3", () => {
    const content = `
Text (subject :: (predicate :: object)),(subject2 :: (predicate2 :: object2))
            `;
    const result: Array<Triple> = [
        {
            subject: {
                value: 'subject'
            },
            predicate: {
                value: 'predicate'
            },
            object: {
                value: 'object'
            }
        },
        {
            subject: {
                value: 'subject2'
            },
            predicate: {
                value: 'predicate2'
            },
            object: {
                value: 'object2'
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});


test("two", () => {
    const content = `
(one :: two) (one :: two),
            `;
    const result: Array<Triple> = [
        {
            predicate: {
                value: 'one'
            },
            object: {
                value: 'two'
            }
        },
        {
            predicate: {
                value: 'one'
            },
            object: {
                value: 'two'
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});

// What happens in this case?
test("my choice 1", () => {
    const content = `
A :: B :: C :: D
            `;
    const result: Array<Triple> = [
        {
            predicate: {
                value: 'A :: B :: C'
            },
            object: {
                value: 'D'
            }
        }
    ]
    expect(getTriples(content)).toEqual(result);
});

test("my choice 3", () => {
    const content = `
(p2 :: o2) s :: (p :: o),
            `;
    const result: Array<Triple> = [
        {
            subject: {
                value: 's'
            },
            predicate: {
                value: 'p'
            },
            object: {
                value: 'o'
            }
        },
        {
            predicate: {
                value: 'p2'
            },
            object: {
                value: 'o2'
            }
        }

    ]
    expect(getTriples(content)).toEqual(result);
});

