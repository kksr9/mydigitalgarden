import { componentRegistry } from "./quartz/components/registry"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

interface TrieNode {
  slugSegment?: string
  displayName?: string
  isFolder: boolean
}

// Controls the order of entries in the sidebar Explorer.
//
// To reorder, or to slot in a new page, edit the `order` list below using each
// page's file or folder name (no extension). Anything not listed falls to the
// bottom, alphabetically.
//
// IMPORTANT, if you edit the function itself: it gets converted to text and
// re-created inside the browser, so it must be completely self-contained.
//   - Everything it uses must be declared inside the function body.
//   - It must not declare any inner functions (the build renames them using a
//     helper that doesn't exist in the browser, which silently empties the
//     sidebar). Keep it to plain statements only.
componentRegistry.setOptionOverrides("@quartz-community/explorer", {
  sortFn: (a: TrieNode, b: TrieNode) => {
    const order = ["about", "why-this-garden", "excerpts-from-my-life"]

    let rankA = order.indexOf(a.slugSegment || "")
    let rankB = order.indexOf(b.slugSegment || "")
    if (rankA === -1) rankA = order.length
    if (rankB === -1) rankB = order.length
    if (rankA !== rankB) return rankA - rankB

    // Unlisted siblings: folders first, then alphabetical.
    if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
    return (a.displayName || "").localeCompare(b.displayName || "", undefined, {
      numeric: true,
      sensitivity: "base",
    })
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
