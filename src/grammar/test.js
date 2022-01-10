// @TODO
// Playing with
// https://chevrotain.io/playground/

(function jsonGrammarOnlyExample() {
  // ----------------- Lexer -----------------
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;

  const True = createToken({name: "True", pattern: /true/});
  const False = createToken({name: "False", pattern: /false/});
  const LParenthesis = createToken({name: "LParenthesis", pattern: /\(/});
  const RParenthesis = createToken({name: "RParenthesis", pattern: /\)/});
  const LSquare = createToken({name: "LSquare", pattern: /\[/});
  const RSquare = createToken({name: "RSquare", pattern: /]/});
  const Comma = createToken({name: "Comma", pattern: /,/});
  const DoubleColon = createToken({name: "DoubleColon", pattern: /\:\:/});

  const SimpleLiteral = createToken({
    name: "SimpleLiteral", pattern: /([^\:()])+/
  });
  const ValueLiteral = createToken({
    name: "ValueLiteral", pattern: /::([^\\n\r:()])+/
  });
  const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /[1-9]\d*/
  })

  const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED
  });

  const jsonTokens = [
    WhiteSpace,
    RParenthesis,
    LParenthesis,
    NumberLiteral,
    Comma,
    True, False,
    SimpleLiteral,
    ValueLiteral,
    LSquare,
    RSquare,
    DoubleColon];

  const JsonLexer = new Lexer(jsonTokens, {
    // Less position info tracked, reduces verbosity of the playground output.
    positionTracking: "onlyStart"
  });

  // Labels only affect error messages and Diagrams.
  LParenthesis.LABEL = "'('";
  RParenthesis.LABEL = "')'";
  LSquare.LABEL = "'['";
  RSquare.LABEL = "']'";
  Comma.LABEL = "','";
  DoubleColon.LABEL = "'::'";

  // ----------------- parser -----------------
  const CstParser = chevrotain.CstParser;

  class JsonParser extends CstParser {
    constructor() {
      super(jsonTokens, {
        recoveryEnabled: true
      })

      const $ = this;

      $.RULE("text", () => {
        $.OR([
          {ALT: () => $.SUBRULE($.ptriple)}
        ]);
      });

      $.RULE("ptriple", () => {
        $.CONSUME(LParenthesis);
        $.SUBRULE($.triple)
        $.CONSUME(RParenthesis);
      });

      $.RULE("triple", () => {
        $.CONSUME(SimpleLiteral)
        $.CONSUME(DoubleColon);
        $.SUBRULE($.ppredicate)
      });

      $.RULE("ppredicate", () => {
        $.CONSUME(LParenthesis);
        $.SUBRULE($.predicate)
        $.CONSUME(RParenthesis);
      });


      $.RULE("predicate", () => {
        $.CONSUME(SimpleLiteral)
        $.CONSUME(DoubleColon);
        $.SUBRULE($.value);
      });

      $.RULE("array", () => {
        $.CONSUME(LSquare);
        $.MANY_SEP({
          SEP: Comma, DEF: () => {
            $.SUBRULE($.value);
          }
        });
        $.CONSUME(RSquare);
      });


      $.RULE("value", () => {
        $.OR([
          {ALT: () => $.CONSUME(SimpleLiteral)},
          {ALT: () => $.CONSUME(NumberLiteral)},

          // {ALT: () => $.SUBRULE($.object)},
          // {ALT: () => $.SUBRULE($.array)},
          {ALT: () => $.CONSUME(True)},
          {ALT: () => $.CONSUME(False)},
          {ALT: () => $.CONSUME(ValueLiteral)},


        ]);
      });

      // very important to call this after all the rules have been setup.
      // otherwise the parser may not work correctly as it will lack information
      // derived from the self analysis.
      this.performSelfAnalysis();
    }

  }

  // for the playground to work the returned object must contain these fields
  return {
    lexer: JsonLexer,
    parser: JsonParser,
    defaultRule: "text"
  };
}())