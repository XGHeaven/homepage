export default function contains(root: Node, n: Node) {
  let node: Node | null = n;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
}
