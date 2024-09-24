import React from 'react';
import './BlogSection.css'; // Make sure to create the corresponding CSS file for styling

const blogs = [
  {
    id: 1,
    title: 'The Future of Technology',
    description: 'Explore the upcoming trends in the tech world.',
    image: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' // Update with the actual image path
  },
  {
    id: 2,
    title: 'Top 10 Gadgets of 2024',
    description: 'Discover the must-have gadgets for the coming year.',
    image: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' // Update with the actual image path
  },
  // Add more blog posts as needed
];

const BlogSection = () => {
  return (
    <div className="blog-section">
      <h2>Latest Articles</h2>
      <div className="blog-container">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            <img src={blog.image} alt={blog.title} className="blog-image" />
            <h3>{blog.title}</h3>
            <p>{blog.description}</p>
            <button className="read-more-button">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
