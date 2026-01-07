export interface Post {
  id: number;
  title: string;
  content: string;
}

export const posts: Post[] = [
  { id: 1,
    title: "First Post",
    content: "Content 1"
  },
  {
    id: 2,
    title: "Second Post",
    content: "Content 2"
  }
];
