const mergeImages = require('merge-images');
const Canvas = require('canvas');
const fs = require("fs");
const path = require('path');

const images_path = '/Users/ikae/Development/images/pokemon2/main-sprites/ruby-sapphire';
const output_file_path = '/Users/ikae/Development/images/icons-large-sprite_ruby-sapphire.png';
const images_size = {width: 64, height: 64};
const output_options = {format: 'image/png', width: 2240, height: 1440};
const sprite_nums = {horizon: 28, vertical: 18};

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

const images_array = [];

fs.readdirSync(images_path).forEach(file => {
	const file_path = path.join(images_path, file);
	const file_name = path.basename(file_path, '.png');
	if (parseInt(file_name)) images_array.push(parseInt(file_name));
});

const result = images_array.sort((a,b) => a-b );

if (result.length==0) {
	console.log('no file found.');
	exit(0);
}

//console.log(result);

let offset_x = 0, offset_y = 0;
const each_block_size = {
	width: output_options.width / sprite_nums.horizon,
	height: output_options.height / sprite_nums.vertical
};
const offset_image_center = {
	x: (each_block_size.width - images_size.width)/2, 
	y: (each_block_size.height - images_size.height)/2
};

const images_src_array = [];
let i=0;
y_loop:
for (let y = 0; y < sprite_nums.vertical; y++) {
	offset_y = (y * each_block_size.height) + offset_image_center.x;
	for(let x=0;x<sprite_nums.horizon;x++) {
		offset_x = (x * each_block_size.width) + offset_image_center.y;
		const file_path = path.join(images_path, `${result[i++]}.png`);
		if (fs.existsSync(file_path)) {
			const image_src = {
				src: file_path,
				x: offset_x,
				y: offset_y
			}
			images_src_array.push(image_src);
		}
		if (i >= result.length) break y_loop;
	}
}

mergeImages(images_src_array, { Canvas: Canvas, format: output_options.format, width: output_options.width, height: output_options.height })		
.then(base64data => new Promise(function (fulfill, reject){
	fs.writeFile(output_file_path, decodeBase64Image(base64data).data, function (err, res){
		if (err) reject(err);
		else fulfill(res);
	});
}))
.catch(e => {
	if (!e) console.log(e);
})	

