require("dotenv").config();
const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

var Translate = require("@google-cloud/translate").v2.Translate;

const langKey = new Map();
langKey.set("Spanish", "es");
langKey.set("Chinese", "zh-CN");
langKey.set("Russian", "ru");
langKey.set("Creole", "ht");

exports.callTranslate = async (req, res) => {
  const lang = req.body.lang;
  const text = req.body.text;
  const gtLang = langKey.get(lang);
  var translate = new Translate({ key: GOOGLE_CLOUD_API_KEY });
  //pass in object language to, text(map of [key:string]:string)
  const translationRequest = {
    languageTo: gtLang,
    text: text,
  };
  async function translateObject(obj) {
    const language = obj.languageTo;
    const textMap = obj.text;
    const translatedKeys = {};
    const translatedVals = {};
    for (const [key, value] of Object.entries(textMap)) {
      try {
        const [translatedKey] = await translate.translate(key, language);
        const [translatedValue] = await translate.translate(value, language);

        translatedKeys[key] = translatedKey;
        translatedVals[key] = translatedValue;
      } catch (error) {
        console.error(`Error translating key-value pair (${key}):`, error);
      }
    }

    return { keys: translatedKeys, vals: translatedVals };
  }

  translateObject(translationRequest)
    .then(function (translatedTextMap) {
      res.json(translatedTextMap);
    })
    .catch(function (error) {
      console.error("Error translating object:", error);
    });
};
