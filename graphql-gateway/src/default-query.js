export default `query findEverything {
  users: users {
    id
  	name
    email
    age
  },
  posts: posts {
    id
    title
    body
    published
  },
  comments: comments {
    id
    text
  }
}

query findAllUsers {
  users {
    id
  	name
    email
    age
  }
}

query findAllPosts {
  posts {
    id
    title
    body
    published
  }
}

query findAllComments {
  comments {
    id
    text
  }
}

query findUsersIncludingPostsAndComments {
  users {
    id
  	name
    email
    age
    posts {
      id
      title
      body
      published
    }
    comments {
      id
      text
    }
  }
}

query findPostsIncludingCommentsWithAuthor {
  posts {
    id
    title
    body
    published
    author {
      id
      name
    }
    comments {
      id
      text
      author {
        id
        name
      }
    }
  }
}

query findCommentsIncludingAuthor {
  comments {
    id
    text
    author {
      id
      name
      email
      age
    }
  }
}

mutation createUser {
  createUser(data: {
    name: "Sample User",
    email: "user1@example.com",
    age: 18
  }) {
    id
    name
    email
    age
  }
}

mutation updateUser {
  updateUser(id: "<replace with user id>", data: {
    email: "user2@example.com"
  }) {
    id
    name
    email
    age
  }
}

mutation createPost {
  createPost (data: {
    title: "My Awesome Blog Post",
    body: "My Awesome Blog Content",
    published: false,
    author: "<replace with user id>"
  }) {
    id
    title
    published
    author {
      id
      name
    }
    comments {
      id
      text
    }
  }
}

mutation updatePost {
  updatePost (id: "<replace with post id>", data: {
    published: true
  }) {
    id
    title
    published
    author {
      id
      name
    }
    comments {
      id
      text
    }
  }
}

mutation createComment {
  createComment (data: {
    text: "My Awesome Comment",
    author: "<replace with user id>",
    post: "<replace with post id>"
  }) {
    id
    text
    author {
      id
      name
      email
    }
    post {
      id
      title
    }
  }
}

mutation updateComment {
  updateComment (id: "<replace with comment id>", data: {
    text: "My Awesome Comment 2"
  }) {
    id
    text
    author {
      id
      name
      email
    }
    post {
      id
      title
    }
  }
}

mutation deleteComment {
  deleteComment (id: "<replace with comment id>")
}

mutation deletePost {
  deletePost (id: "<replace with post id>")
}

mutation deleteUser {
  deleteUser(id: "<replace with user id>")
}
`
