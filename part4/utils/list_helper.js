const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => {
    return acc + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((fav, blog) => {
    if (fav) {
      return (fav.likes < blog.likes) ? blog : fav;  
    } else {
      return blog;
    }
  }, null);
};

export default { dummy, totalLikes, favoriteBlog };