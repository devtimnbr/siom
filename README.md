# Siom

Siom stands for **s**harp **i**mage **o**ptimizer **m**icroservice and explains itself. It is used to resize images on the fly, convert images to webp and is very powerful behind a cache proxy like [Choxy](https://github.com/devtimnbr/choxy). 

## Request parameters
The microservice uses url parameters to pass informations like the image source, width, height and a lot more. (bolds are default values)

| Parameter | Description | 
| --- | --- |
| src | image source url with protocol |
| w | width |
| h | height |
| q | quality (0-100) |
| f | fit (**cover**, contain, fill, inside, outside) |
| p | positon (**center**, top, right top, right, right bottom, bottom, left bottom, left, left-top) |
| bg | background color as hex value (**#000**) |
| format | image fromat (**webp**, png, jpeg, gif)