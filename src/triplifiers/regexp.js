const LINKS_REGEXP = /(\[\[[^\]\n]*\]\])/g

//  (un :: (texto :: bonito))
const SPO_REGEXP = /\(\s*([^)]+)\s*::\s*\(([^)]+)\s*::\s*([^)]+)\s*\)\)/g

//  un :: (texto :: bonito)
const SPOnp_REGEXP = /([^\n\\)]+)\s*::\s*\(([^)]+)\s*::\s*([^)]+)\s*\)/g

// (texto :: bonito)
const PO_REGEXP = /\(([^)]+)\s*::\s*([^)]+)\s*\)/g

// texto :: bonito
const POnp_REGEXP = /([^\n]+)::([^\n]+)/g


export {
  LINKS_REGEXP,
  SPO_REGEXP,
  SPOnp_REGEXP,
  PO_REGEXP,
  POnp_REGEXP
}