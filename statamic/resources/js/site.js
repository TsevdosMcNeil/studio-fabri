import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import morph from '@alpinejs/morph'
import persist from '@alpinejs/persist'
import focus from '@alpinejs/focus'
import intersect from '@alpinejs/intersect'
import 'focus-visible'

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

// Global get CSRF token function (used by forms).
window.getToken = async () => {
    return await fetch('/!/statamic-peak-tools/dynamic-token/refresh')
        .then((res) => res.json())
        .then((data) => {
            return data.csrf_token
        })
        .catch((error) => {
            this.error = 'Something went wrong. Please try again later.'
        })
}

// Call Alpine.
window.Alpine = Alpine
Alpine.plugin([collapse, focus, morph, persist, intersect])
Alpine.start();

// PhotoSwipeLightbox
const arrowSVGString = '<svg version="1.1" aria-hidden="true" class="pswp__icn" width="30" height="30" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.27 31.27" style="enable-background:new 0 0 31.27 31.27;" xml:space="preserve"><polygon points="15.64,0 14.36,1.27 27.83,14.74 0,14.74 0,16.54 27.83,16.54 14.36,30 15.64,31.27 31.27,15.64 "/></svg>';

const closeSVGString = '<svg version="1.1" aria-hidden="true" class="pswp__icn" width="30" height="30" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.27 31.27" style="enable-background:new 0 0 31.27 31.27;" xml:space="preserve"><polygon points="31.27,1.27 30,0 15.64,14.36 1.27,0 0,1.27 14.36,15.64 0,30 1.27,31.27 15.64,16.91 30,31.27 31.27,30 16.91,15.64 "/></svg>';


const lightbox = new PhotoSwipeLightbox({
    arrowPrevSVG: arrowSVGString,
    arrowNextSVG: arrowSVGString,
    closeSVG: closeSVGString,
    gallery: '.pswp-gallery',
    children: 'a',
    zoom: false,
    initialZoomLevel: 'fit',
    secondaryZoomLevel: 'fit',
    showHideAnimationType: 'fade',
    /* 
        Developer note:
        This is the duration of the show/hide animation for the lightbox.
        It is set to 20000ms (20 seconds) to allow the developer to catch all elements involved add modify them accordingly (i.e. the image placeholder)

        showAnimationDuration: 20000,
    */
    
    pswpModule: () => import('photoswipe')
});

/*
    Developer note:
    The following code is used to remove the thumbnail image from the lightbox. To do that we need to set msrc as null.
    The PhotoSwipeLightbox plugin uses the thumbnail dimensions as a reference to display the real image. But our thumbnails are cropped, so their aspect ratio is different from the real image. That means that the plugin is loading the real image by forcing it to the wrong aspect ratio, and when the file is fully loaded the browser adjusts it to its real aspect ratio, trigering a little ugly jump. 

    @see https://github.com/dimsemenov/PhotoSwipe/issues/854
    @see https://photoswipe.com/data-sources/#custom-html-markup

*/
lightbox.addFilter(
    'domItemData', 
    (   itemData, 
        element, 
        linkEl
    ) => {
        if (linkEl) {
            itemData.msrc = null;
        }
    return itemData;
});


lightbox.on('uiRegister', function() {
    lightbox.pswp.ui.registerElement({
        name: 'custom-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: 'Caption text',
        onInit: (el, pswp) => {
            lightbox.pswp.on('change', () => {
                const currSlideElement = lightbox.pswp.currSlide.data.element;
                let captionHTML = '';
                if (currSlideElement) {
                        const figCaption = currSlideElement.querySelector('figcaption');
                        if (figCaption) {
                            // get caption from figcaption
                            captionHTML = figCaption.innerHTML;
                        } 
                }
                el.innerHTML = captionHTML || '';
            });
        }
    });
});

lightbox.init();
  