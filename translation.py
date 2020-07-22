from googletrans import Translator
fp = open("translate_text.txt", "w")
translator = Translator()
result = translator.translate('안녕하세요', dest = 'ja')
fp.write(result[0])
fp.close()

