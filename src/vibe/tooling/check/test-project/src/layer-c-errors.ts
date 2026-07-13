import { createUser, type UserProfile } from "./layer-a";
import { getAuthorAge, createPost, type Post } from "./layer-b";

// Error 1: age must be number, passing string
const user: UserProfile = createUser("u1", "twenty-five" as never, "a@b.com");

// Error 2: getAuthorAge returns number, not string
const age: string = getAuthorAge(user);

// Error 3: Post is missing required field 'title'
const post: Post = {
  id: "p1",
  authorId: "u1",
  viewCount: 0,
};

// Error 4: viewCount is number, not string
const post2 = createPost("u1", "Hello");
const count: string = post2.viewCount;

export { user, age, post, post2, count };
