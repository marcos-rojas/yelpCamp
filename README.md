# YelpCamp - CRUD application

This is a project whith focus on learning the main fullstack features that
someone have to give to an application. This project doesn't implement
a UI framework like React or Angular yet, most of the rendering is made
with EJS templates while styles are mainly Bootstrap5.


## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Future goal](#future-goals)
- [Author](#author)

## Overview
Order summary cards are common when buying products or suscribing to some
services. The flow of information as well as UI is very important to engage
potential users.
Link: 
### The challenge
Make a responsive card with price, description and play functionality. Also,
there is a change option as well as payment/cancel buttons. It has interactivity
when hover buttons, thus user knows state of its options.

### Screenshot

![Preview for the Order summary card desktop](./design/desktop-view.jpg)
![Preview for the Order summary card phone](./design/iphone-view.jpg)

### Links

- Live Site URL: [Add live site URL here](https://shielded-forest-07450.herokuapp.com/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- Future challenge: [React JS](https://reactjs.org/)

### What I learned

Although there is not a new feature about layout, the use of flexbox
to center sections as well as using hover selectors, box shadow and
variables for color are always present for UI. I really liked using
data-* attributes as a way to play sound.

```html
<div class="info">
        <button type="button" class="music" data-key="1">
        </button>
        <section class="plan_price">
          <h3>Annual Plan</h3> 
          <p>$59.99/year</p> 
        </section>
        <div class="option">
          <a href="">Change</a>
        </div>
      </div>
```

```js
    let song = document.querySelector(`audio[data-key="${songId}"]`);
    song.currentTime = 0;
    song.play();
}
```

### Continued development

I would like to implement a more responsive option for devices whose screen is very
thin or new fold-way phones. I would prefer to try the design with ReactJS as well
as add interactivity and functionality for payment and routing for implementation
in a bigger project.

## Author

- Website - [Marcos Rojas](https://marcos-rojas.github.io/portfolio/)
- Frontend Mentor - [@marcos-rojas](https://www.frontendmentor.io/profile/marcos-rojas)
