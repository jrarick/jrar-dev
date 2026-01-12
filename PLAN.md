# Refactor Sidebar to Use Tree Component

## Overview

Refactor `app/components/page-sections/sidebar.tsx` to use the `app/components/tree.tsx` component, converting the flat link list into a hierarchical tree structure where Blog and Projects have nested children (their respective posts/projects).

## Current State

- **Sidebar**: Flat list of 5 links (Index, Blog, Bookmarks, Projects, Tools)
- **Tree Component**: Styled React Aria tree with expand/collapse, but currently shows checkboxes when selection is enabled
- **Nested Content**:
  - Blog: 6 posts loaded dynamically via `import.meta.glob`
  - Projects: 6 projects loaded dynamically via `import.meta.glob`

## Requirements

1. Tree items must be navigable links (using `href` prop)
2. No checkboxes should appear
3. Active route should be visually indicated
4. Blog and Projects should be expandable parents with their children nested underneath
5. Maintain mobile sidebar functionality (with close button)

## Implementation Plan

### Step 1: Update TreeItem Component (`app/components/tree.tsx`)

**Changes needed:**
- Remove the checkbox rendering logic entirely (lines 81-83)
- Add support for `href` prop to enable link navigation
- Ensure the component passes through `href` to `AriaTreeItem`
- Update styles to show active/selected state without checkbox dependency

**Key insight from docs**: TreeItem accepts `href` directly - clicking navigates, and we can use `selectedKeys` to highlight the active route.

### Step 2: Create Navigation Tree Data Structure

Create a new file or add to sidebar.tsx a data structure and loader/hook for the tree:

```typescript
interface NavItem {
  id: string
  title: string
  href?: string
  children?: NavItem[]
}
```

- Static items: Index, Bookmarks, Tools (no children)
- Dynamic items: Blog, Projects (with children loaded from MDX files)

### Step 3: Refactor SidebarContent (`app/components/page-sections/sidebar.tsx`)

**Changes:**
1. Import the `Tree` and `TreeItem` components
2. Replace the `<ul>` with `<Tree selectionMode="none">` (or controlled single selection)
3. Use recursive rendering for nested items
4. Use `useLocation()` to determine active route and set `defaultExpandedKeys`
5. Style tree items to match current sidebar aesthetic (horizontal padding, hover states)

**Selection Strategy**:
- Option A: `selectionMode="none"` - no selection state, rely on CSS `:focus` or custom active styling
- Option B: `selectionMode="single"` with `selectionBehavior="replace"` and controlled `selectedKeys` based on current pathname - this highlights the active item

**Recommendation**: Use Option B with `selectionMode="single"` + controlled `selectedKeys`. The `isSelected` style in tree.tsx already provides the visual active state. Since we're using `href` on TreeItems, clicking will navigate (primary action) rather than select.

### Step 4: Load Blog/Project Children Dynamically

Two approaches:

**Approach A - Server-side (Recommended)**
- Create a shared loader utility that both the sidebar and index pages can use
- Export the loader data via a context or use React Router's data loading
- Ensures consistency and avoids duplicate glob logic

**Approach B - Client-side**
- Use `import.meta.glob` directly in the sidebar component
- Simpler but duplicates the glob pattern from route files

**Recommendation**: Approach B is simpler for now since the MDX frontmatter is already eagerly loaded at build time. We can extract the glob logic into a shared utility later.

### Step 5: Update Tree Styles for Sidebar Context

The current tree styles assume a bordered container. For sidebar use:
- Remove/override the container border and padding
- Adjust item padding to match existing sidebar spacing (px-4 py-2)
- Ensure nested items are indented appropriately
- Match the existing color scheme (primary-accent for active, app-muted for inactive)

## Files to Modify

1. `app/components/tree.tsx` - Remove checkbox logic, ensure href support works correctly
2. `app/components/page-sections/sidebar.tsx` - Main refactor work

## Files to Potentially Create

- `app/lib/navigation.ts` - Optional shared utility for loading blog/project slugs with titles

## Considerations

### Mobile Behavior
- The mobile sidebar uses `SidebarContent` with `onLinkClick` and `onClose` props
- Tree links with `href` should trigger navigation automatically via React Router's client-side routing
- May need to add `onSelectionChange` or use React Router's navigation events to trigger `onLinkClick`

### Expanded State
- Auto-expand the parent (Blog or Projects) when viewing a child route
- Use `defaultExpandedKeys` or controlled `expandedKeys` based on pathname

### Performance
- MDX glob is eager at build time, so no runtime loading concern
- Tree with ~15 items total is trivial to render

## Example Final Structure

```
jrar.dev
├── Index          (link to /)
├── Blog           (expandable, link to /blog)
│   ├── Post 1     (link to /blog/post-1)
│   ├── Post 2     (link to /blog/post-2)
│   └── ...
├── Bookmarks      (link to /bookmarks)
├── Projects       (expandable, link to /projects)
│   ├── Project 1  (link to /projects/project-1)
│   ├── Project 2  (link to /projects/project-2)
│   └── ...
└── Tools          (link to /tools)
```
