import blog from './../models/blog.js';
import Blog from './../models/blog.js';
import User from './../models/user.js';

const blogList = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }  
];

const nonExistingId = async () => {
  const blog = new Blog( {
    title: "An Introduction to Lock-Free Programming",
    author: "Jeff Preshing",
    url: "https://preshing.com/20120612/an-introduction-to-lock-free-programming/",
    likes: 4
  });

  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON());
};

const blogInDB = async (id) => {
  const blog = await Blog.findById(id);
  return blog.toJSON();
}

const usersInDB = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

export default {
  blogList,
  nonExistingId, 
  blogInDB, 
  blogsInDb,
  usersInDB,
 };