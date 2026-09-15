
# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


## [0.7.3] - 2026-09-15

### Added

 - Nginx configuration
  
## [0.7.2] - 2026-09-15

### Added

 - Staging files

## [0.7.1] - 2026-08-14

### Updated

 - Markdown files
 - Removed config files from repository
 - Statamic enviromental variables 
   - All managed from Docker enviromental variables

## [0.7.0] - 2026-08-14

### Added

 - Docker files

## [0.6.0] - 2026-04-22

### Added

 - Build Files


## [0.5.10] - 2026-04-22

### Updated

- Favicon
  - Added `STATAMIC_CUSTOM_FAVICON_URL="/favicons/favicon.svg"` to the `.env` file to set the favicon for the website. The favicon file is located in `public/favicons/favicon.svg`.
  - Updated `resources/views/layout.antlers.html` to get the path of the favicon (this is managed in `config/statamic/cp.php`)

## [0.5.9] - 2026-04-10

### Updated

- robots.txt
- Nginx configuration



## [0.5.8] - 2026-04-10

### Updated

- Statamic Updated to latest v5 version (5.73.19)


## [0.5.7] - 2026-04-10

### Added

- SEO
  - Redirect Add-on
  - robots.txt



## [0.5.6] - 2026-03-20

### Added

- [Server compromised](https://app.asana.com/1/355454733208534/project/1207332254977844/task/1213628914745390)
  -  Image Recovery Script 

## [0.5.5] - 2025-06-30

### Updated

- [Image Hover](https://app.asana.com/1/355454733208534/project/1207332254977844/task/1210571335510271) 


## [0.5.4] - 2024-12-11

### Updated

- [Screen Size Scale Issue](https://app.asana.com/0/1207332254977844/1208737859167788) 
    - Remove Lenis effect for screen widths less than 1280px (xl)


## [0.5.3] - 2024-11-04

### Fixed

- [Home - Services Scroll](https://app.asana.com/0/1207332254977844/1208337120762096) 
    - I added another service and this issue has happened again - it doesn't scroll the whole way . Can you please look into it so it doesn't cut off the last service.


## [0.5.2] - 2024-11-04

### Fixed

- [Projects - Related Projects](https://app.asana.com/0/1207332254977844/1208682218707538) Related project image updated


## [0.5.1] - 2024-09-27

### Fixed

- [Projects - Mobile](https://app.asana.com/0/inbox/355454733208538/1208401376925622/1208413294909935)


## [0.4.2] - 2024-09-26

### Fixed
- JS error in Projects page

### Updated

Laravel updated to `11.24`

Livewire updated to `3.5.8`

## [0.4.1] - 2024-09-25

### Changed

- Added `config/livewire.php` to the repository becasuse du the latest updates Livewire crashees by default.

## [0.4.0] - 2024-09-23

### Updated

Statamic updated to `5.25`

## [0.3.21] - 2024-09-23

### Changed

- [Snap Points](https://app.asana.com/0/1207332254977844/1208337120762029) Remove the script in desktop.


- [Projects -> New Projects](https://app.asana.com/0/1207332254977844/1208368932865291) Gap between Project 5 and 6 larger


- [Mobile -> Contact](https://app.asana.com/0/1207332254977844/1208337120761968) Make the image slightly taller


## [0.3.20] - 2024-09-22

### Changed

- [Snap Points](https://app.asana.com/0/1207332254977844/1208337120762029) Create a new script that first checks if the content fits completely on the screen, if it does, then it runs the parallax effect, and if it doesn't, then it doesn't run.


- [Projects > Image sizes/position](https://app.asana.com/0/1207332254977844/1208053100693968) Edit the format of the image in project 2 

- [Snap points -> About Page](https://app.asana.com/0/1207332254977844/1208336453745821) Change h3,h4 form 30px to 24px


### Added

- [Projects > Toggle](https://app.asana.com/0/1207332254977844/1208368932865260) New toggle element to enable/disable project link


### Fixed

- [Home > Services Scroll](https://app.asana.com/0/1207332254977844/1208337120762096) The Lenis element doesn’t scroll the whole way


## [0.3.19] - 2024-09-22

### Changed

- [CODIGO: Home -> carousel -> Transition](https://app.asana.com/0/1207419952215016/1208124213723725) Add hover and cursor pointer to the entire next arrow element
    - [TM: Home -> carousel -> Transition](https://app.asana.com/0/1207332254977844/1208053100693959) Allow click to change to next photo


- [CODIGO: Errores en mobile -> Contact](https://app.asana.com/0/1207419952215016/1208349471015211) Change specific image height in get in touch section
    - [TM: Mobile -> Contact](https://app.asana.com/0/1207332254977844/1208337120761968) 


## [0.3.18] - 2024-09-20

### Changed

- [About Page -> Parallax](https://app.asana.com/0/1207332254977844/1208053099300001) Lenis speed increased
    - `scroll_speed` from `0.002` to `0.005`; 
    - `scroll_path` from `500vh` to `300vh`; 


- [Projects -> Image sizes/position](https://app.asana.com/0/1207332254977844/1208053100693968) Project card fieldset
    -  Position that image (project 2) 150px lower

- [Services](https://app.asana.com/0/1207332254977844/1208053100693957) Text changed from 30px to 19px


## [0.3.17] - 2024-09-19

### Added

- [CODIGO: Caption](https://app.asana.com/0/1207419952215016/1208349471015186) Add text color field to caption element
    - [TM: About page -> Caption issue](https://app.asana.com/0/1207332254977844/1208053099300003) 
    

### Fixed

- [CODIGO: Errores en mobile -> Imagen se superpone al texto](https://app.asana.com/0/1207419952215016/1208349471015194) Fix image element in mobile
    - [TM: Mobile -> About](https://app.asana.com/0/1207332254977844/1208337120761978) 
    - [TM: Mobile -> About - How We Work](https://app.asana.com/0/1207332254977844/1208337120761985) 


- [CODIGO: Errores en mobile -> Menu](https://app.asana.com/0/1207419952215016/1208349471015216) Fix viewport height of header menu
    - [TM: Mobile -> Menu](https://app.asana.com/0/1207332254977844/1208337120761973) The yellow menu page appears at the top throughout the whole site when you scroll. This seems to happen only on newer iphones.


- [CODIGO: Errores en mobile -> Home](https://app.asana.com/0/1207419952215016/1208349471015208) Fix header logo after splash animation
    - [TM: Mobile -> Home](https://app.asana.com/0/1207332254977844/1208337120761961)  Pinaco letters don't match when you first load the website. It's a temporary effect but it is quite noticeable. Can we remove/fix that?


## [0.3.16] - 2024-09-16

### Added

- Project single page

- [Image sizes/position](https://app.asana.com/0/1207332254977844/1208053100693968) Projects grid


## [0.3.15] - 2024-08-28

### Changed

- [Services -> Accordion -> New layout](https://app.asana.com/0/1207332254977844/1208053100693957) Add modification to allow closing the accordion


## [0.3.14] - 2024-08-27

### Added

- [Home -> Services](https://app.asana.com/0/1207332254977844/1208053099299992) Lenis Horizontal effect


## [0.3.13] - 2024-08-26

### Changed

- [Caption 'i' icon](https://app.asana.com/0/inbox/355454733208538/1208124213723718/1208149267053882) Changes in image caption template

- [Caption 'i' icon](https://app.asana.com/0/inbox/355454733208538/1208124213723718/1208149267053882) New pop direction field

- Font size for XL and 2XL screens

- Big icon size for XL and 2XL screens




## [0.3.12] - 2024-08-23

### Changed

- [Services -> Accordion -> New layout](https://app.asana.com/0/1207332254977844/1208053100693957) Accordion layout changes

- [Homepage -> Carousel -> Transition](https://app.asana.com/0/1207332254977844/1208053100693959) Change home carousel transition

- [Homepage -> Carousel -> Arrows](https://app.asana.com/0/1207332254977844/1208053100693960) Change the color of the carousel arrows from white to black

- [Menu -> Gaps](https://app.asana.com/0/1207332254977844/1208053099299995) Change menu items gap



## [0.3.11] - 2024-08-09

### Added

- Projects Index layout

### Changed

- Image marging with caption

## [0.3.10] - 2024-08-05

### Added

- Spacer component

- Column snnipet

- Section Background video snippet

- Section Collapsable snippet

### Changed

- Member card fieldset mobile viewport

- About us page

- Footer


## [0.3.9] - 2024-07-31

### Added

- Member card fieldset

- Background color on pages

- Big Icon fieldset

### Changed

- Image caption margin

## [0.3.8] - 2024-07-31

### Added

- Read more fieldset

## [0.3.7] - 2024-07-23

### Added

- [Accordion](https://app.asana.com/0/1207419952215016/1207813626469372) Expand only one element at a time in accordion component


## [0.3.6] - 2024-07-22

### Added

- [Splash](https://app.asana.com/0/inbox/355454733208538) Add Javascript promise to splash: Preload and wait for image loading to activate the splash animation

## [0.3.5] - 2024-07-19

### Added

- [Splash](https://app.asana.com/0/inbox/355454733208538) Add site splash

### Fixed

- Compilation Tailwind error


## [0.3.4] - 2024-07-18

### Added

- [Accordion](https://app.asana.com/0/1207419952215016/1207813626469372) New accordion element added


## [0.3.3] - 2024-07-18

### Added

- [Services horizontal list](https://app.asana.com/0/1207419952215016/12078136264672241) New horizontal list element added


## [0.3.2] - 2024-07-18

### Added

- [Menu](https://app.asana.com/0/1207419952215016/1207813626467221) Add new header menu


## [0.3.1] - 2024-07-15

### Added

- CHANGELOG.md

### Hotfix

-  Hotfix: Carousel fixed ratio

### Changed

- README.md

## [0.3.0] - 2024-06-08

### Added

- Mobile version

## [0.2.5] - 2024-06-08

### Hotfix

-  Change the scroll down button position

## [0.2.4] - 2024-06-08

### Changed

- Changes in carousel
	- Speed changed from 300ms to 1500ms
	- The time between 2 autoplay slides has changed from 5s to 3s

## [0.2.3] - 2024-06-08

### Added

- Change arrows position and colour
- Change scroll down button styles

## [0.2.2] - 2024-06-08

### Added

- Adding tailwind classes for buttons
- Changing deafult tag for buttons
- Adding text and background colour to buttons
- Updating carousel arrows
- Adding extra style filed to sections
- Increasing Lenis Scroll path 

## [0.2.1] - 2024-06-08

### Added

- Updating md - xl layout
- Adding logo to login page
- Mobile layout for holding page
- New floating component added
- Lenis: new variable "Time lag between elements of the same section" added

## [0.2.0] - 2024-06-08

### Added

- Beta version

## [0.1.10] - 2024-06-08

### Added

- Lenis configuration updated
- Force height to 100% for the slider
- Updated colours

## [0.1.9] - 2024-06-08

### Added

-  Headers font sizes changed
-  Base font changed to 19px
-  New field "height_class" added to carousel component
-  Custom component "Logo Corners"

## [0.1.8] - 2024-06-08

### Added

- Lenis added

## [0.1.7] - 2024-06-08

### Added

- TinySlider CSS added

## [0.1.6] - 2024-06-08

### Added

- TinySlider attributes added

## [0.1.3] - 2024-06-08

### Added

- Adding buttons
- Hide/show footer button
- Spacer component added
- Adding fonts
        
## [0.1.2] - 2024-06-08

### Added

- Adding theme colours
        
## [0.1.1] - 2024-06-08

### Added

- Adding theme logo
        
## [0.1.0] - 2024-06-08

### Added

- First version