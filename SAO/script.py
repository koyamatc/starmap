import json

in_file = open("sao","r")
name_file = open("starname.txt","r")
jname_file = open("starnameJ.txt","r")
out_file = open("sao.json","w")

name_data = json.load(name_file)
jname_data = json.load(jname_file)

print name_data["   308"]
print jname_data["   308"]

text = '[ \n'
out_file.write(text)

for row in in_file:

	id = row[0:6]
	mag = float(row[80:84])
	num = int(row[0:6])
	
	if id == "184415":
		spectral = "M1 "
	else:	
		spectral = row[84:87]

	color = "#fff"

	if spectral[0:1] == "O":
		color = "#21BAED"
	elif 	spectral[0:1] == "B":
		color =  "#95D7ED"
	elif 	spectral[0:1] == "A":
		color =  "#D3F5EF"
	elif 	spectral[0:1] == "F":
		color =  "#fff"
	elif 	spectral[0:1] == "G":
		color =  "#fff"
	elif 	spectral[0:1] == "K":
		color =  "#ff0"
	elif 	spectral[0:1] == "M":
		color =  "#f00"
	elif 	spectral[0:1] == "L":
		color =  "#f00"
	elif 	spectral[0:1] == "T":
		color =  "#f00"

	

	
	if mag < 0.5:
			radius = 6
	elif mag <1.5:
			radius = 5
	elif mag < 2.7:
			radius = 4
	elif mag < 3.5:
			radius = 3
	elif mag < 4.5:
			radius = 2
	else:
			radius = 1

	if row[0:6] in name_data:
		label = name_data[row[0:6]]
	else:
		label = ""

	if row[0:6] in jname_data:
		jlabel = "u'"+ jname_data[row[0:6]] + "'"
	else:
		jlabel = ""


	if row[6:7] !="D":

		if mag < 7:

			text = "{"
			text += '"id":' + row[0:6]
			text += ',"RA":"' + row[183:193] + '"'
			text += ',"dec":"' + row[193:204] + '"'
			text += ',"RA-pm":"' + row[160:167] + '"'
			text += ',"dec-pm":"' + row[177:183] + '"'
			text += ',"spectral":"' + spectral + '"'
			text += ',"color":"' + color + '"'
			text += ',"mag":"' + row[80:84] + '"'
			text += ',"r":"' + str(radius) + '"'
			text += ',"label":"' + label + '"'
			text += ',"jlabel":' + jlabel 

			text += "}, \n"

			print text
			
			out_file.write(text)

text = "]"
out_file.write(text)


out_file.close()
in_file.close()
name_file.close()
jname_file.close()
