const mergeImages = require('merge-images');
const Canvas = require('canvas');
const fs = require("fs");
const path = require('path');

const background_images_path = 'C:\\Users\\ikae\\Desktop\\Test\\gym\\teams';
const foreground_images_path = 'C:\\Users\\ikae\\Desktop\\Test\\gym\\icons';
const output_path = 'C:\\Users\\ikae\\Desktop\\Test\\gym\\outputs';

const output_options = {format: 'image/png', width: 96, height: 96};
const background_offset = { x: 0, y: 0 };
const foreground_offset = { x: 16, y: 16 };

const pokemonWithImages = [
	2, 3, 5, 6, 8, 9, 11, 28, 31, 34, 38, 59, 62, 65, 68, 71, 73, 76, 82, 89, 91, 94, 103, 105, 110, 112, 123, 125, 126, 129, 131, 134,
	135, 136, 137, 139, 143, 144, 145, 146, 150, 153, 156, 159, 243, 244, 245, 248, 249, 250, 302
]

function decodeBase64Image(dataString) 
{
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3) 
  {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

const background_images_array = [];

fs.readdirSync(background_images_path).forEach(file => {
	const file_path = path.join(background_images_path, file);
	const file_name = path.basename(file_path, '.png');
  background_images_array.push(file_path);
});

const foreground_images_array = [];

fs.readdirSync(foreground_images_path).forEach(file => {
	const file_path = path.join(foreground_images_path, file);
	const file_name = path.basename(file_path, '.png');
	if (pokemonWithImages.indexOf(parseInt(file_name))>=0){
		foreground_images_array.push(file_path);
	}
});

const result = [];
background_images_array.forEach(background_file_path => {
	foreground_images_array.forEach(foreground_file_path => {
		const output_file_name = `${path.basename(background_file_path,'.png')}_${path.basename(foreground_file_path,'.png')}.png`;
		const output_file_path = path.join(output_path, output_file_name);

		mergeImages([{ src: background_file_path, x: background_offset.x, y: background_offset.y }, { src: foreground_file_path, x: foreground_offset.x, y: foreground_offset.y }], { Canvas: Canvas, format: output_options.format, width: output_options.width, height: output_options.height })		
		.then(base64data => new Promise(function (fulfill, reject){
			fs.writeFile(output_file_path, decodeBase64Image(base64data).data, function (err, res){
				if (err) reject(err);
				else fulfill(res);
			});
		}))
		.catch(e => {
			if (!e) console.log(e);
		})	
	})
})
