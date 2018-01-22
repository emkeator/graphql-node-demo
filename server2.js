var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

// GraphQL schema
var schema = buildSchema(`
    input CourseInput {
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Mutation {
        createCourse(input: CourseInput): Course
        updateCourseTopic(id: Int!, topic: String!): Course
        updateCourseDesc(id: Int!, description: String!): Course
        deleteCourse(id: Int!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

class Course {
    constructor(id, {title, author, description, topic, url}) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.description = description;
      this.topic = topic;
      this.url = url;
    }
  }
  

//Above you can see the schema is containing a Mutation type. The mutation which is defined is named updateCourseTopic and takes two mandatory parameter: id and topic. The return type of that mutation is Course.

var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

var getCourse = function(args) { 
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var updateCourseTopic = function({id, topic}) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id) [0];
}

var updateCourseDesc = function({id, description}) {
    coursesData.map(course => {
        if(course.id === id) {
            course.description = description;
            return course;
        }
    })
    return coursesData.filter(course => course.id === id)[0]
}

var deleteCourse = function({id}) {
    coursesData.map((course, i) => {
        if(course.id === id) {
            coursesDate.splice(i, 1)
            return course;
        }
    })
    return coursesData   
}

var createCourse = function({input}) {
    var id = coursesData.length + 1
    coursesData[id] = new Course(id, input)
    return new Course(id, input);
}


var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic,
    updateCourseDesc: updateCourseDesc,
    deleteCourse: deleteCourse,
    createCourse: createCourse
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));