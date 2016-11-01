in_file = open("sao","r")
out_file = open("sao.json","w")

text = '[ \n'
out_file.write(text)

for row in in_file:

	mag = float(row[80:84])
	num = int(row[0:6])

	if row[6:7] !="D":

		if mag < 5:

			text = "{"
			text += '"id":' + row[0:6]
			text += ',"RA":"' + row[183:193] + '"'
			text += ',"dec":"' + row[193:204] + '"'
			text += ',"RA-pm":"' + row[160:167] + '"'
			text += ',"dec-pm":"' + row[177:183] + '"'
			text += ',"mag":"' + row[80:84] + '"'
			text += ',"label":""'

			text += "}, \n"
			out_file.write(text)

text = "]"
out_file.write(text)


out_file.close()
in_file.close()
