const ffmpeg = require("fluent-ffmpeg");

const util = require("util");
const ffprobeAsync = util.promisify(ffmpeg.ffprobe);

const validateVideoLink = async (videoLink) => {
  try {
    const metadata = await ffprobeAsync(videoLink);
    if (metadata.streams && metadata.streams.length > 0) {
      return Promise.resolve(); // Valid video link
    } else {
      return Promise.reject("Invalid video link");
    }
  } catch (error) {
    console.error("Error validating video link:", error);
    return Promise.reject("Invalid video link");
  }
};


module.exports = { validateVideoLink };
