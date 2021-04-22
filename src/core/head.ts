export interface HeadChildren {
  title?: string;
  description?: string;
  keywords?: string | string[];
  author?: string;
  generator?: string;
  metas?: Record<string, string>;
}

export type CreateHeadChildren<P> = (params: P) => HeadChildren;

export function mergeHeadChildren(head1: HeadChildren, head2: HeadChildren) {
  return {
    ...head1,
    ...head2,
    metas: {
      ...head1.metas,
      ...head2.metas,
    },
  };
}
