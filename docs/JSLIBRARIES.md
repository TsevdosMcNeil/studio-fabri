
# Add JS Libraries

### 1. Example: Install Tiny Slider

```sh
npm install tiny-slider
```

### 2. Add custom JS

Edit `resources/js/site.js`

```js
...
import tinyslider from './modules/tinyslider';
...

// Call custom modules.
const CDG = {

    onreadyFunctions: function() {
        //consoleHello('CDG is ready');
        //preloader();
        tinyslider();

        window.addEventListener("resize", function(){
            //consoleHello('window has resized');
            if(window.innerWidth < 768){
                //consoleHello('narrow');
            }
            else{
                //consoleHello('wide');
            }
         });
    },

    onloadFunctions: function() {
        //consoleHello('CDG is loaded');
    }
};

CDG.onreadyFunctions();

window.onload = function(event) {
    CDG.onloadFunctions();
};

```
