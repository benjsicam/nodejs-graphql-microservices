export default `mutation signup {
  signup(data: {
    name: "Sample User",
    email: "user1@example.com",
    password: "admin1234"
    age: 18
  }) {
    token
    user {
      id
      name
      email
      age
      createdAt
      updatedAt
      version
    }
  }
}

mutation login {
  login(data: {
    email: "user1@example.com",
    password: "admin1234"
  }) {
    token
    user {
      id
      name
      email
      age
    }
  }
}

mutation createPost {
  createPost (data: {
    title: "My Awesome Blog Post",
    body: "My Awesome Blog Content",
    published: false
  }) {
    id
    title
    published
    createdAt
    updatedAt
    version
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
    createdAt
    updatedAt
    version
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
    post: "<replace with post id>"
  }) {
    id
    text
    createdAt
    updatedAt
    version
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
    createdAt
    updatedAt
    version
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

query me {
  me {
    id
    name
    email
    age
    createdAt
    updatedAt
    version
    posts {
      id
      title
      body
    }
    comments {
      id
      text
    }
  }
}

query myPosts {
  myPosts {
    id
    title
    body
    createdAt
    updatedAt
    version
  }
}

query findEverything {
  users: users {
    id
  	name
    email
    age
    createdAt
    updatedAt
    version
  },
  posts: posts {
    id
    title
    body
    published
    createdAt
    updatedAt
    version
  },
  comments: comments {
    id
    text
    createdAt
    updatedAt
    version
  }
}

query findAllUsers {
  users {
    id
  	name
    email
    age
    createdAt
    updatedAt
    version
  }
}

query findAllPosts {
  posts {
    id
    title
    body
    published
    createdAt
    updatedAt
    version
  }
}

query findAllComments {
  comments {
    id
    text
    createdAt
    updatedAt
    version
  }
}

query findUsersIncludingPostsAndComments {
  users {
    id
  	name
    email
    age
    createdAt
    updatedAt
    version
    posts {
      id
      title
      body
      published
      createdAt
    	updatedAt
    	version
    }
    comments {
      id
      text
      createdAt
      updatedAt
      version
    }
  }
}

query findPostsIncludingCommentsWithAuthor {
  posts {
    id
    title
    body
    published
    createdAt
    updatedAt
    version
    author {
      id
      name
      createdAt
      updatedAt
      version
    }
    comments {
      id
      text
      author {
        id
        name
        createdAt
        updatedAt
        version
      }
    }
  }
}

query findCommentsIncludingAuthor {
  comments {
    id
    text
    createdAt
    updatedAt
    version
    author {
      id
      name
      email
      age
      createdAt
      updatedAt
      version
    }
  }
}

query findUser {
  user(id: "<replace with user id>") {
    id
    name
    email
    age
    createdAt
    updatedAt
    version
  }
}

query findPost {
  post(id: "<replace with post id>") {
    id
    title
    body
    createdAt
    updatedAt
    version
    author {
      id
      name
    }
  }
}

query commentCount {
  commentCount
}

query postCount {
  postCount
}

query userCount {
  userCount
}

mutation updateProfile {
  updateProfile (data: {
    name: "Sample User 2",
    age: 19
  }) {
    id
    name
    email
    age
  	createdAt
    updatedAt
    version
  }
}

mutation updateEmail {
  updateEmail (data: {
    email: "sample2@example.com",
    currentPassword: "admin1234"
  }) {
    token
    user {
      id
      name
      email
      age
      createdAt
      updatedAt
      version
    }
  }
}

mutation updatePassword {
  updatePassword (data: {
    currentPassword: "admin1234",
    newPassword: "user12345",
    confirmPassword: "user12345"
  }) {
    token
    user {
      id
      name
      email
      age
      createdAt
      updatedAt
      version
    }
  }
}

mutation deleteComment {
  deleteComment (id: "<replace with comment id>")
}

mutation deletePost {
  deletePost (id: "<replace with post id>")
}

mutation deleteAccount {
  deleteAccount
}
`
