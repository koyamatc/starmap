import json

in_file = open("sao","r")
name_file = open("starname.txt","r")
out_file = open("sao.json","w")

name_data = json.load(name_file)

print name_data["   308"]

text = '[ \n'
out_file.write(text)

for row in in_file:

	id = row[0:6]
	mag = float(row[80:84])
	num = int(row[0:6])

	if row[0:6] in name_data:
		label = name_data[row[0:6]]
	else:
		label = ""


	if row[6:7] !="D":

		if mag < 5:

			text = "{"
			text += '"id":' + row[0:6]
			text += ',"RA":"' + row[183:193] + '"'
			text += ',"dec":"' + row[193:204] + '"'
			text += ',"RA-pm":"' + row[160:167] + '"'
			text += ',"dec-pm":"' + row[177:183] + '"'
			text += ',"mag":"' + row[80:84] + '"'
			text += ',"label":"' + label + '"'

			text += "}, \n"
			out_file.write(text)

text = "]"
out_file.write(text)


out_file.close()
in_file.close()
