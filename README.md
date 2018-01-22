## Server.js

npm init -y
npm install express --save

npm install graphql express-graphql --save 

```
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');

```

To test the query in the graphql api server run: 

{
  hello
}



# Server2.js

Query 1: 

query getSingleCourse($courseID: Int!) {
    course(id: $courseID) {
        title
        author
        description
        topic
        url
    }
}

The getSingleCourse query operation is expecting to get one parameter: $courseID of type Int. By usign the exclamation mark we’re specifying that this parameters needs to be provided.

Within the getSingleCourse we’re executing the course query and for this specific ID. We’re specifying that we’d like to retrieve title, author, description, topic and url of that that specific course.

Because the getSingleCourse query operation uses a dynamic parameter we need to supply the value of this parameter in the Query Variables input field as well:

{ 
    "courseID":1
}



Query 2: 

query getCourseWithFragments($courseID1: Int!, $courseID2: Int!) {
      course1: course(id: $courseID1) {
             ...courseFields
      },
      course2: course(id: $courseID2) {
            ...courseFields
      } 
}

fragment courseFields on Course {
  title
  author
  description
  topic
  url
}

As you can see the query operations requires two parameters: courseID1 and courseID2. The first ID is used for the first query and the second ID is used for the second query.

Another feature which is used is a fragment. By using a fragment we’re able to avoid repeating the same set of fields in multiple queries. Instead we’re defining a reusable fragment with name courseFields and specific which fields are relevent for both queries in one place.

Before executing the query operation we need to assign values to the parameters:

{ 
    "courseID1":1,
    "courseID2":2
}



Query 3: 

With GraphQL we’re also able to modify data. by using Mutations.

A mutation operation is defined by using the mutation keyword followed by the name of the mutation operation. In the following example the updateCourseTopic mutation is included in the operation and again we’re making use of the courseFields fragment.

mutation updateCourseTopic($id: Int!, $topic: String!) {
  updateCourseTopic(id: $id, topic: $topic) {
    ... courseFields
  }
}

fragment courseFields on Course {
  title
  author
  description
  topic
  url
}

The mutation operation is using two dynamic variables so we need to assign the values in the query variables input field as follows:

{
  "id": 1,
  "topic": "JavaScript"
}


By executing this mutation we’re changing the value of the topic property for the course data set with ID 1 from Node.js to JavaScript. As a result we’re get back the changed course.


```
{
  "data": {
    "updateCourseTopic": {
      "title": "The Complete Node.js Developer Course",
      "author": "Andrew Mead, Rob Percival",
      "description": "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
      "topic": "JavaScript",
      "url": "https://codingthesmartway.com/courses/nodejs/"
    }
  }
}
```


Query 4: 

mutation updateCourseDesc($id: Int!, $description: String!) {
  updateCourseDesc(id: $id, description: $description) {
    ...courseFields
  }
}

fragment courseFields on Course {
  title
  author
  description
  topic
  url
}


{
  "id": 1,
  "description": "changing stuff"
}


Query 5: 


mutation deleteCourse($id: Int!) {
  deleteCourse(id: $id) {
    ...courseFields
  }
}

fragment courseFields on Course {
  title
  author
  description
  topic
  url
}


{
  "id": 1
}

Query 6: 

mutation {
  createCourse(input: {
        title: "hello",
        author: "Testing",
        description: "create",
        topic: "date",
        url: "url"
  }) {
    id
  }
}