# Javascript for Java dev

## Comments

**Java**
```java
// single line comments

/* multi
line comments */

/**
 * Docstring
 * @params {String} a - blablabla
 */
 ```
  
**Javascript**
```javascript
// single line comments

/* multi
line comments */

/**
 * Docstring
 * @params {string} a - blablabla
 */
```

## Semicolon

**Java**
```java
someStatement(); // with semicolon
someStatement() // without semicolon, error
```

**Javascript**
```javascript
someStatement(); // with semicolon
someStatement() // without semicolon, ok
```

## Arithmetic Operator

**Java**
```java
1 + 1; // = 2
0.1 + 0.2; // = 0.30000000000000004
8 - 1 // = 7
10 * 2; // = 20
35 / 5; // = 7
5 / 2; // = 2.5
5f / 2f; // = 2.5f
5.0 / 2.0; // = 2.5
10 % 2; // = 0
30 % 4; // = 2
```

**Javascript**
```javascript
1 + 1; // = 2
0.1 + 0.2; // = 0.30000000000000004
8 - 1 // = 7
10 * 2; // = 20
35 / 5; // = 7
5 / 2; // = 2.5
5.0 / 2.0; // = 2.5
10 % 2; // = 0
30 % 4; // = 2
```

Semua angka di Javascript disimpan sebagai _64-bit IEEE 754 double_, sedangkan Java memiliki `int`, `float`, dan `double`.

## Precedence

**Java**
```java
(1 + 3) * 2; // = 8
2 + (2 - 1) * 8 // = 10
```

**Javascript**
```javascript
(1 + 3) * 2; // = 8
2 + (2 - 1) * 8 // = 10
```

## Infinity

**Java**
```java
Double.POSITIVE_INFINITY
Double.NEGATIVE_INFINITY
```

**Javascript**
```javascript
Infinity
-Infinity
```

## Boolean

**Java**
```java
true
false
```

**Javascript**
```javascript
true
false
```

## String & Char

**Java**
```java
"Something" // String
'c' // char
```

**Javascript**
```javascript
"Something" // string
'Something' // string
"s" // string
's' // string
```

## Negation

**Java**
```java
!true // = false
!false // = true
```

**Javascript**
```javascript
!true // = false
!false // = true
```

## Equality

**Java**
```java
1 == 1 // = true
1 != 1 // = true
'1' == 1 // = error
"false" == "bar" // = true
"false" == false // = error
"false".equals("bar") // = false
```

**Javascript**
```javascript
// equality check
1 == 1 // = true
1 != 1 // = true
'1' == 1 // = true
"false" == "bar" // = false
"false" == false // = true
// strict equality check
1 === 1 // = true
1 !== 1 // = true
'1' === 1 // = false
"false" === "bar" // = false
"false" === false // = false
```
 
## Comparison

**Java**
```java
1 < 10; // = true
1 > 10; // = false
2 <= 2; // = true
2 >= 2; // = true
```

**Javascript**
```javascript
1 < 10; // = true
1 > 10; // = false
2 <= 2; // = true
2 >= 2; // = true
```

## String Concatenation (and more)

**Java**
```java
"Hello " + "world!"; // = "Hello world!"
"1, 2, " + 3; // = "1, 2, 3"
```

**Javascript**
```javascript
"Hello " + "world!"; // = "Hello world!"
"1, 2, " + 3; // = "1, 2, 3"
"Hello " + ["world", "!"]; // = "Hello world,!"
"a" < "b"; // = true
```

## Truthy / Falsy

**Java**
```java
null
```

**Javascript**
```javascript
null;
undefined;
// false, null, undefined, NaN, 0 and "" are falsy; everything else is truthy.
// Note that 0 is falsy and "0" is truthy, even though 0 == "0".
```

## Variables

**Java**
```java
String name = "Manusia bernapas";
int age = 12;
boolean hasHighscore = true;
int a = 0, b = 0, c = 0;
```

**Javascript**
```javascript
// 3 keywords
name = "Manusia Bernapas";
var name = "Manusia Bernapas";
let name = "Manusia Bernapas";
const name = "Manusia Bernapas";
const a = 0, b = 0, c = 0;
```

## Shorthand

**Java**
```java
i++;
i--;
++i;
--i;
i += 1;
i -= 2;
i *= 3;
```

**Javascript**
```javascript
i++;
i--;
++i;
--i;
i += 1;
i -= 2;
i *= 3;
```

## Array / List

**Java**
```java
String[] foo = { "1", "2", "3" };
foo[2] // = "3"
foo.size() // = 3
foo[2] = "4" // = { "1", "2", "4" }
```

**Javascript**
```javascript
const foo = ["1", 30, false];
foo[2] // = 30
foo.push("World");
foo.length; // = 4
foo[2] = 123 // = ["1", 30, 123]
```

## Object

**Java**
```java
// sebenernya bisa pake class
// tapi nanti di Javascript juga ada class yang lebih mirip
// class di Javascript under the hood itu pakenya object juga
// tapi dikasih syntactical sugar biar mirip kaya class biasanya
```

**Javascript**
```javascript
const person = {
name: "Manusia Bernapas",
age: 12,
"has highscore": true
}

person.name // = "Manusia Bernapas"
person.age = 20 // person.age === 20
person["has highscore"] // = true
```

## Control Structure

**Java**
```java
int number = 2;
if (number > 2) {
System.out.println("Number is bigger than 2");
} else if (number == 2) {
System.out.println("Number is equal to 2");
} else {
System.out.println("Number is smaller or equal to 2");
}
```

**Javascript**
```javascript
const number = 2;
if (number > 2) {
console.log("Number is bigger than 2");
} else if (number === 2) {
console.log("Number is equal to 2");
} else {
console.log("Number is smaller or equal to 2");
}
```

### While Loop

**Java**
```java
while (condition) {
// do something
}
```

**Javascript**
```javascript
while (condition) {
// do something
}
```

### Do-While Loop

**Java**
```java
do {
// do something
} while (condition)
```

**Javascript**
```javascript
do {
// do something
} while (condition)
```

### For Loop

**Java**
```java
for (int i = 0; i < 10; i++) {
System.out.println(i);
}
```

**Javascript**
```javascript
for (let i = 0; i < 10; i++) {
console.log(i);
}
```

### Switch Statement

**Java**
```java
char grade = 'B';
switch (grade) {
case 'A':
System.out.println("Great job");
break;
case 'B':
System.out.println("OK job");
break;
case 'C':
System.out.println("You can do better");
break;
default:
System.out.println("Oy vey");
break;
}
```

**Javascript**
```javascript
const grade = 'B';
switch (grade) {
case 'A':
console.log("Great job");
break;
case 'B':
console.log("OK job");
break;
case 'C':
console.log("You can do better");
break;
default:
console.log("Oy vey");
break;
}
```

## Function / Method

### Function Definition

**Java**
```java
String upper(String text) {
return text.toUpperCase();
}

upper("foo"); // = "FOO"
```

**Javascript**
```javascript
function upper(text) {
return text.toUpperCase();
}

upper("foo"); // = "FOO"
```

### Arrow Functions

**Java**
```java
(String text) -> text.toUpperCase();
```

**Javascript**
```javascript
const upper = (text) => {
return text.toUpperCase();
};
const upper = (text) => text.toUpperCase();
upper("foo"); // = "FOO"
```

### Array Methods

**Java**
```java
// No direct equivalent
```

**Javascript**
```javascript
[1, 2, 3].map((f) => f * 2) // = [2, 4, 6]
[1, 2, 3].map((f) => f * 2) // = [2, 4, 6]
```
...

## Exception Handling

**Java**
```java
try {
// code that may throw an exception
} catch (ExceptionType1 e1) {
// handle exception of type ExceptionType1
} catch (ExceptionType2 e2) {
// handle exception of type ExceptionType2
} finally {
// optional block that always executes
}
```

**Javascript**
```javascript
try {
// code that may throw an exception
} catch (error1) {
// handle exception
} finally {
// optional block that always executes
}
```

## Classes and Objects

**Java**
```java
class Dog {
  String breed;
  int age;

  Dog(String breed, int age) {
    this.breed = breed;
    this.age = age;
  }

  void bark() {
    System.out.println("Woof!");
  }
}

Dog myDog = new Dog("Labrador", 3);
myDog.bark();
```

**Javascript**
```javascript
class Dog {
  constructor(breed, age) {
    this.breed = breed;
    this.age = age;
  }

  bark() {
    console.log("Woof!");
  }
}

const myDog = new Dog("Labrador", 3);
myDog.bark();
````

## Asynchronous Programming

**Java**
```java
// Java does not have built-in support for asynchronous programming comparable to Javascript
```

**Javascript**
```javascript
// Asynchronous programming with Promises
function asyncFunction() {
  return new Promise((resolve, reject) => {
    // asynchronous code
    if (success) {
      resolve(result);
    } else {
      reject(error);
    }
  });
}

asyncFunction()
  .then((result) => {
    // handle success
  })
  .catch((error) => {
    // handle error
  });
````
