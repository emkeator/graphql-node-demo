var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var coursesData = require('./data.js');

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
            coursesData.splice(i, 1)
            return course;
        }
    })
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


