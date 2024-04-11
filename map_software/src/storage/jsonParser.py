import json

input_file = 'snapshot_new.json'
output_file = 'output.json'

def transform_data(input_data):
    output_data = []
    for network in input_data['IAS']['System']['networks']:
        if 'IMT' in network['network']:
            bs_data = network['network']['IMT']['deployment']['BS']
            ue_data = network['network']['IMT']['UE']
            
            for i, bs in enumerate(bs_data):
                base_station_id = f"BS_{i}"
                bs_lat = bs['location']['latitude']
                bs_long = bs['location']['longitude']
                
                ue_list = [ue for ue in ue_data if ue['base_station_id'] == i]
                ue_output = []
                for j, ue in enumerate(ue_list):
                    ue_output.append({
                        "UE_ID": f"UE_{i}_{j}",
                        "Latitude": ue['location']['latitude'],  
                        "Longitude": ue['location']['longitude'] 
                    })
                
                output_data.append({
                    "Base_Station_ID": base_station_id,
                    "Latitude": bs_lat,
                    "Longitude": bs_long,
                    "UEs": ue_output
                })
    
    return output_data

with open(input_file, 'r') as file:
    input_json = json.load(file)

transformed_data = transform_data(input_json)

with open(output_file, 'w') as file:
    json.dump(transformed_data, file, indent=4)

print(f"Data transformed and saved to {output_file}")
