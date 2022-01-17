type Triple = {
    subject?: Term,
    predicate: Term,
    object: Term
}
type Term = any

export {Triple, Term, TermKind}