# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [comment.proto](#comment.proto)
    - [Comment](#comment.Comment)
    - [CommentList](#comment.CommentList)
    - [CreateCommentInput](#comment.CreateCommentInput)
    - [UpdateCommentInput](#comment.UpdateCommentInput)
  
  
  
    - [CommentService](#comment.CommentService)
  

- [commons.proto](#commons.proto)
    - [Count](#commons.Count)
    - [Id](#commons.Id)
    - [Query](#commons.Query)
  
  
  
  

- [post.proto](#post.proto)
    - [CreatePostInput](#post.CreatePostInput)
    - [Post](#post.Post)
    - [PostList](#post.PostList)
    - [UpdatePostInput](#post.UpdatePostInput)
  
  
  
    - [PostService](#post.PostService)
  

- [user.proto](#user.proto)
    - [CreateUserInput](#user.CreateUserInput)
    - [UpdateUserInput](#user.UpdateUserInput)
    - [User](#user.User)
    - [UserList](#user.UserList)
  
  
  
    - [UserService](#user.UserService)
  

- [Scalar Value Types](#scalar-value-types)



<a name="comment.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## comment.proto



<a name="comment.Comment"></a>

### Comment



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| text | [string](#string) |  |  |
| author | [string](#string) |  |  |
| post | [string](#string) |  |  |
| createdAt | [string](#string) |  |  |
| updatedAt | [string](#string) |  |  |
| version | [int32](#int32) |  |  |






<a name="comment.CommentList"></a>

### CommentList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| list | [Comment](#comment.Comment) | repeated |  |






<a name="comment.CreateCommentInput"></a>

### CreateCommentInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| text | [string](#string) |  |  |
| author | [string](#string) |  |  |
| post | [string](#string) |  |  |






<a name="comment.UpdateCommentInput"></a>

### UpdateCommentInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| data | [Comment](#comment.Comment) |  |  |





 

 

 


<a name="comment.CommentService"></a>

### CommentService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| findAll | [.commons.Query](#commons.Query) | [CommentList](#comment.CommentList) |  |
| findOne | [.commons.Query](#commons.Query) | [Comment](#comment.Comment) |  |
| count | [.commons.Query](#commons.Query) | [.commons.Count](#commons.Count) |  |
| create | [CreateCommentInput](#comment.CreateCommentInput) | [Comment](#comment.Comment) |  |
| update | [UpdateCommentInput](#comment.UpdateCommentInput) | [Comment](#comment.Comment) |  |
| destroy | [.commons.Id](#commons.Id) | [.commons.Count](#commons.Count) |  |

 



<a name="commons.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## commons.proto



<a name="commons.Count"></a>

### Count



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| count | [int32](#int32) |  |  |






<a name="commons.Id"></a>

### Id



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |






<a name="commons.Query"></a>

### Query



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| query | [string](#string) |  | Should&#39;ve been google.protobuf.Struct type but still not supported https://groups.google.com/d/msg/protobuf/1772tpAr3N4/pngSAwmIBgAJ |





 

 

 

 



<a name="post.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## post.proto



<a name="post.CreatePostInput"></a>

### CreatePostInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| title | [string](#string) |  |  |
| body | [string](#string) |  |  |
| published | [bool](#bool) |  |  |
| author | [string](#string) |  |  |






<a name="post.Post"></a>

### Post



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| title | [string](#string) |  |  |
| body | [string](#string) |  |  |
| published | [bool](#bool) |  |  |
| author | [string](#string) |  |  |
| createdAt | [string](#string) |  |  |
| updatedAt | [string](#string) |  |  |
| version | [int32](#int32) |  |  |






<a name="post.PostList"></a>

### PostList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| list | [Post](#post.Post) | repeated |  |






<a name="post.UpdatePostInput"></a>

### UpdatePostInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| data | [Post](#post.Post) |  |  |





 

 

 


<a name="post.PostService"></a>

### PostService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| findAll | [.commons.Query](#commons.Query) | [PostList](#post.PostList) |  |
| findOne | [.commons.Query](#commons.Query) | [Post](#post.Post) |  |
| count | [.commons.Query](#commons.Query) | [.commons.Count](#commons.Count) |  |
| create | [CreatePostInput](#post.CreatePostInput) | [Post](#post.Post) |  |
| update | [UpdatePostInput](#post.UpdatePostInput) | [Post](#post.Post) |  |
| destroy | [.commons.Id](#commons.Id) | [.commons.Count](#commons.Count) |  |

 



<a name="user.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## user.proto



<a name="user.CreateUserInput"></a>

### CreateUserInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| name | [string](#string) |  |  |
| email | [string](#string) |  |  |
| password | [string](#string) |  |  |
| age | [int32](#int32) |  |  |






<a name="user.UpdateUserInput"></a>

### UpdateUserInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| data | [User](#user.User) |  |  |






<a name="user.User"></a>

### User



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| name | [string](#string) |  |  |
| email | [string](#string) |  |  |
| password | [string](#string) |  |  |
| age | [int32](#int32) |  |  |
| createdAt | [string](#string) |  |  |
| updatedAt | [string](#string) |  |  |
| version | [int32](#int32) |  |  |






<a name="user.UserList"></a>

### UserList



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| list | [User](#user.User) | repeated |  |





 

 

 


<a name="user.UserService"></a>

### UserService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| findAll | [.commons.Query](#commons.Query) | [UserList](#user.UserList) |  |
| findOne | [.commons.Query](#commons.Query) | [User](#user.User) |  |
| count | [.commons.Query](#commons.Query) | [.commons.Count](#commons.Count) |  |
| create | [CreateUserInput](#user.CreateUserInput) | [User](#user.User) |  |
| update | [UpdateUserInput](#user.UpdateUserInput) | [User](#user.User) |  |
| destroy | [.commons.Id](#commons.Id) | [.commons.Count](#commons.Count) |  |

 



## Scalar Value Types

| .proto Type | Notes | C++ Type | Java Type | Python Type |
| ----------- | ----- | -------- | --------- | ----------- |
| <a name="double" /> double |  | double | double | float |
| <a name="float" /> float |  | float | float | float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long |
| <a name="bool" /> bool |  | bool | boolean | boolean |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str |

