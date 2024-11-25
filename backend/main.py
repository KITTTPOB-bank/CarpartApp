from fastapi import FastAPI, Header, File, UploadFile, Form
import jwt
from pymongo.mongo_client import MongoClient
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
from datetime import datetime
import smtplib
import string    
import random 
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import torch
import torch.nn as nn
from torchvision.transforms import transforms
from torch.autograd import Variable
import torchvision.models as models
from PIL import Image
import torchvision.transforms as transforms
from io import BytesIO
from datetime import datetime
import boto3
import io


app = FastAPI()
uri = "uri"
app.max_request_size = 1024 * 1024  * 1000

client = MongoClient(uri)
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=[        "Accept",
        "Accept-Encoding",
        "Authorization",
        "Content-Type",
        "DNT",
        "Origin",
        "User-Agent",
        "X-Requested-With",],
)

SECRET_KEY = "Mizanocarnan"
ALGORITHM = "HS256"


@app.get("/")
async def root():
    return {"message": "Hello my server"}

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


class userdata(BaseModel):
    email: str
    password: str


@app.post("/register")
async def register(data: userdata):
    db = client.carpartdata
    col = db.user
    coltoken = db.token
    user_data = col.find_one({"email": data.email})
    if user_data:
        return False
    ts = datetime.now()
    user_data = {
        "email": data.email,
        "password": data.password,
    }
    token = create_access_token(user_data)
    latest_doc = col.aggregate([
        {"$sort": {"_id": -1}},
        {"$limit": 1}
    ])
    latest_doc = next(latest_doc, None)
    latest_id = latest_doc['_id'] + 1
    data_dict = {
        "_id" : latest_id,
        "email": data.email,
        "password": data.password,
        "bill_list" : [],
        "owncar_list": []
    }
    data_dict_token = {
        "_id" : latest_id,
        "user_id" : latest_id,
        "token": token,
        "time_stamp": ts
    }
    col.insert_one(data_dict)
    coltoken.insert_one(data_dict_token)
    return {"token": token}


class LoginData(BaseModel):
    email: str
    password: str


@app.post("/login")
async def login(data: LoginData):
    # ตรวจสอบว่าข้อมูลผู้ใช้ตรงกับฐานข้อมูลหรือไม่
    db = client.carpartdata
    col = db.user
    coltol = db.token
    print(data.email)
    print(data.password)
    filters = {"token": 1}
    user_data = col.find_one({"email": data.email, "password": data.password}, filters)
    if (user_data):
        token = coltol.find_one({"user_id": user_data["_id"]})
    response_data = {
        "token" : token['token']
    }
    return JSONResponse(response_data)
 
class forgot(BaseModel):
    email: str

@app.post("/forgotpassword")
async def forgotpassword(data : forgot):
    S = 10  
    ran = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S))    
    db = client.carpartdata
    col = db.user
    coltol = db.token
    user_data = col.find_one({"email": data.email})
    if user_data:
        # creates SMTP session
        s = smtplib.SMTP('smtp.gmail.com', 587)
        s.starttls()
  
        col.update_one(
        {"_id": user_data["_id"]},
        {"$set": {
            "password": str(ran),
        }})
        resetuserdata = {
            "email": user_data["email"],
            "password": str(ran),
        }
        token = create_access_token(resetuserdata)
        coltol.update_one(
        {"_id": user_data["_id"]},
        {"$set": {
            "token": token,
        }})
        response_data = {
        "alert" : "รหัสผ่านใหม่ของคุณถูกส่งไปที่อีเมล์แล้ว"
        }
        return JSONResponse(response_data)
    else:
        response_data = {
        "alert" : "กรุณาตรวจสอบอีเมล์ของคุณ"
        }
        return JSONResponse(response_data)
    

class Reset(BaseModel):
    token: str
    newpassword: str
@app.post("/resetpassword")
async def resetpassword(data : Reset):
    db = client.carpartdata
    col = db.user
    coltol = db.token
    user = verify_token(data.token)
    user_data = col.find_one({"email": user["email"]})
    if user_data:
        col.update_one(
        {"_id": user_data["_id"]},
        {"$set": {
            "password": str(data.newpassword),
        }})
        resetuserdata = {
            "email": user_data["email"],
            "password": str(data.newpassword),
        }
        token = create_access_token(resetuserdata)
        coltol.update_one(
        {"_id": user_data["_id"]},
        {"$set": {
            "token": token,
        }})
        response_data = {
        "token" : token
        }
        return JSONResponse(response_data)
    else:
        response_data = {
        "token" : None
        }
        return JSONResponse



@app.get("/getdatacar")
async def getdatacar():
    db = client.carpartdata
    col = db.car
    filters = {"name" : 1,"brand": 1, "year": 1, "car_image": 1, "_id": 1}
    data = list(col.find({}, filters))
    return JSONResponse(data)


@app.get("/getuser")
async def getuser(token: str):
    db = client.carpartdata
    coluser = db.user
    colcar = db.car
    colbill = db.bill
    user = verify_token(token)
    print(user['email'])
    getdatauser = coluser.find_one(
        {"email": user['email']}
    )
    filters = {"name" : 1,"brand": 1, "year": 1, "car_image": 1,  "_id": 1}

    getcardata = colcar.find(
        {"_id": {"$in": getdatauser['owncar_list']}}, filters)
    getbilldata = colbill.find(
        {"_id": {"$in": getdatauser['bill_list']}})
    response_data = {
        "idfav": getdatauser['owncar_list'],
        "getcardata": list(getcardata),
        "getbilldata": list(getbilldata)
    }
    return JSONResponse(response_data)


@app.get("/getpartcar")
async def getpartcar(name: str, brand: str, year: int):
    db= client.carpartdata
    col = db.car
    print(name)
    print(brand)
    print(year)
    filters = {"frontbumper_list": 1, "rearbumper_list": 1, "grille_list": 1,
               "headlamp_list": 1, "backuplamp_list": 1, "mirror_list": 1, "door_list": 1}
    documents = col.find_one(
        {"name": name, "brand": brand, "year": year}, filters)
    frontbumper_data = db.frontbumper.find(
        {"_id": {"$in": documents['frontbumper_list']}})
    rearbumper_data = db.rearbumper.find(
        {"_id": {"$in": documents['rearbumper_list']}})
    grille_data = db.grille.find(
        {"_id": {"$in": documents['grille_list']}})
    door_data = db.door.find(
        {"_id": {"$in": documents['door_list']}})
    mirror_data = db.mirror.find(
        {"_id": {"$in": documents['mirror_list']}})
    headlamp_data = db.headlamp.find(
        {"_id": {"$in": documents['headlamp_list']}})
    backuplamp_data = db.backuplamp.find(
        {"_id": {"$in": documents['backuplamp_list']}})

    response_data = {
        "frontbumper": list(frontbumper_data),
        "rearbumper": list(rearbumper_data),
        "grille": list(grille_data),
        "door": list(door_data),
        "mirror": list(mirror_data),
        "headlamp": list(headlamp_data),
        "backuplamp": list(backuplamp_data),
    }
    return JSONResponse(response_data)

@app.get("/getlist")
async def getlist(bill_id: int):
    db = client.carpartdata
    col = db.bill
    data = col.find_one({'_id': bill_id})
    return JSONResponse(data)

class dropbill(BaseModel):
    bill_id: int
    token :str

@app.post("/dropbill")
async def dropcarpartbill(dropbill : dropbill):
    db = client.carpartdata
    colbill = db.bill
    coluser = db.user
    user = verify_token(dropbill.token)
    getdatauser = coluser.find_one(
        {"email": user['email']}
    )
    print(getdatauser["bill_list"])

    print(dropbill.bill_id)
    getdatauser["bill_list"].remove(dropbill.bill_id)

    coluser.update_one(
        {"email": user['email']},
        {"$set": {'bill_list':  getdatauser["bill_list"]}}
    )
    colbill.delete_one({"_id" : dropbill.bill_id})

class dropfav(BaseModel):
    type: int
    token :str
    idcar :int

@app.post("/dropfav")
async def dropcarpartbill(dropfav : dropfav):
    db = client.carpartdata
    coluser = db.user
    user = verify_token(dropfav.token)
    getdatauser = coluser.find_one(
        {"email": user['email']}
    )
    newfav = []
    if (dropfav.type == 0):
        newfav = [item for item in getdatauser["owncar_list"] if item != dropfav.idcar]

    else:
        newfav.append(dropfav.idcar)
        newfav.extend(getdatauser["owncar_list"])

    print(newfav)

    coluser.update_one(
        {"email": user['email']},
        {"$set": {'owncar_list': newfav }}
    )

### โหลดโมเดล
model_frontnumber = models.resnet50()
model_frontnumber.load_state_dict(torch.load("model-resnet50-datasetfrontbumper70-30.pt", map_location='cpu'))
model_frontnumber.eval()


model_rearbumper = models.resnet50()
model_rearbumper.load_state_dict(torch.load("model-resnet50-dataseraer60-40.pt", map_location='cpu'))
model_rearbumper.eval()


model_door = models.resnet50()
model_door.load_state_dict(torch.load("model-resnet50-datasedoor90-10.pt", map_location='cpu'))
model_door.eval()

model_headlight = models.resnet50()
model_headlight.load_state_dict(torch.load("model-resnet50-headlamp70-30.pt", map_location='cpu'))
model_headlight.eval()


model_taillight = models.resnet50()
model_taillight.load_state_dict(torch.load("model-resnet50-backupLamp60-40.pt", map_location='cpu'))
model_taillight.eval()

model_body = models.resnet50()
model_body.load_state_dict(torch.load("model-ResNet50-body-90-10.pt", map_location='cpu'))
model_body.eval()

@app.post("/uploadcar")
async def upload_parts(filesF: List[UploadFile] = File(None),
                   filesR: List[UploadFile] = File(None),
                   filesB: List[UploadFile] = File(None),):
    classes = ['Honda Accord 2017', 'Honda Accord 2018', 'Honda Accord 2019', 'Honda Civic 2018', 'Honda Civic 2019', 'Honda Civic 2020', 'Honda Civic 2021', 'Toyota Camry 2017', 'Toyota Camry 2018', 'Toyota Camry 2019', 'Toyota Camry 2020', 'Toyota Camry 2021', 'Toyota CorollaCross 2022', 'Toyota CorollaCross 2023', 'Toyota Yaris 2017', 'Toyota Yaris 2018', 'Toyota Yaris 2019', 'Toyota Yaris 2020']
    transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
    ])

    print("A")
    keepF= []
    keepR= []
    keepB= []

    predictresult = []

    if filesF:
        for file in filesF:
            contents = await file.read()
            image = Image.open(BytesIO(contents)).convert("RGB")
            image = image.resize((224, 224))
            image_tensor = transform(image).unsqueeze(0)  
            def predict(image_tensor):
                with torch.no_grad():
                    input_img = Variable(image_tensor)
                    output = model_body(input_img)

                    softmax = nn.Softmax(dim=1)
                    probabilities = softmax(output)
                    max_prob, predicted_class = torch.max(probabilities, 1)
                    pred_class_name = classes[predicted_class.item()]
                return {"prediction": pred_class_name, "probability": max_prob.item()}
            result = predict(image_tensor)
            keepF.append(result)
        max_probability_result = max(keepF, key=lambda x: x["probability"])
        predictresult.append(max_probability_result)
    else:
        print(1)

    if filesR:
        for file in filesR:
            contents = await file.read()
            image = Image.open(BytesIO(contents)).convert("RGB")
            image = image.resize((224, 224))

            image_tensor = transform(image).unsqueeze(0)  
            def predict(image_tensor):
                with torch.no_grad():
                    input_img = Variable(image_tensor)
                    output = model_body(input_img)

                    softmax = nn.Softmax(dim=1)
                    probabilities = softmax(output)
                    max_prob, predicted_class = torch.max(probabilities, 1)
                    pred_class_name = classes[predicted_class.item()]
                return {"prediction": pred_class_name, "probability": max_prob.item()}
            result = predict(image_tensor)
            keepR.append(result)
        max_probability_result = max(keepR, key=lambda x: x["probability"])
        predictresult.append(max_probability_result)
    else: 
        print(2)
    if filesB:
        for file in filesB:
            contents = await file.read()
            image = Image.open(BytesIO(contents)).convert("RGB")
            image = image.resize((224, 224))

            image_tensor = transform(image).unsqueeze(0)  
            def predict(image_tensor):
                with torch.no_grad():
                    input_img = Variable(image_tensor)
                    output = model_body(input_img)

                    softmax = nn.Softmax(dim=1)
                    probabilities = softmax(output)
                    max_prob, predicted_class = torch.max(probabilities, 1)
                    pred_class_name = classes[predicted_class.item()]
                return {"prediction": pred_class_name, "probability": max_prob.item()}
            result = predict(image_tensor)
            keepB.append(result)
        max_probability_result = max(keepB, key=lambda x: x["probability"])
        predictresult.append(max_probability_result)
    else:
        print(3)


    result_max = max(predictresult, key=lambda x: x["probability"])
    rounded_probability = round(result_max['probability'] * 100, 2)
    db = client.carpartdata
    col = db.car
    model = result_max['prediction']
    brand, name, year = model.split(" ")
    filters = {"car_image": 1}

    carimage = col.find_one({"name": name, "brand": brand, "year": int(year)}, filters)
    print(carimage)
    response_data = {
        "prediction": result_max['prediction'],
        "probability": rounded_probability,
        "car_image": carimage['car_image']
    }
    
    return JSONResponse(response_data)



def uploads_types(file, folder_path, bucket_name, folder, filename):
    s3 = boto3.client('s3', aws_access_key_id='****',
                      aws_secret_access_key='***')
    filename_without_path = filename.split('/')[-1]

    s3_file_key = f"{folder}/{folder_path}/{filename_without_path}"
    s3.upload_fileobj(io.BytesIO(file), bucket_name, s3_file_key)
    acl = 'public-read'
    s3.put_object_acl(Bucket=bucket_name, Key=s3_file_key, ACL=acl)

    return "สำเร็จ"


@app.post("/uploadparts")
async def upload_parts(filesF: List[UploadFile] = File(None),
                   filesR: List[UploadFile] = File(None),
                   filesD: List[UploadFile] = File(None),
                   filesB: List[UploadFile] = File(None),
                   filesE: List[UploadFile] = File(None)):
    classes = ['Honda Accord 2017', 'Honda Accord 2018', 'Honda Accord 2019', 'Honda Civic 2018', 'Honda Civic 2019', 'Honda Civic 2020', 'Honda Civic 2021', 'Toyota Camry 2017', 'Toyota Camry 2018', 'Toyota Camry 2019', 'Toyota Camry 2020', 'Toyota Camry 2021', 'Toyota CorollaCross 2022', 'Toyota CorollaCross 2023', 'Toyota Yaris 2017', 'Toyota Yaris 2018', 'Toyota Yaris 2019', 'Toyota Yaris 2020']
    transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
    ])
    keepF= []
    keepR= []
    keepD= []
    keepB= []
    keepE= []
    predictresult = []
    bucket_name = 'carimageapp'
    folder = 'Trendmodelpicturefromuser'
    if filesF:
        for file in filesF:
            contents = await file.read()
            image = Image.open(BytesIO(contents)).convert("RGB")
            image = image.resize((224, 224))
            image_tensor = transform(image).unsqueeze(0)  
            def predict(image_tensor):
                with torch.no_grad():
                    input_img = Variable(image_tensor)
                    output = model_frontnumber(input_img)

                    softmax = nn.Softmax(dim=1)
                    probabilities = softmax(output)
                    max_prob, predicted_class = torch.max(probabilities, 1)
                    pred_class_name = classes[predicted_class.item()]
                return {"prediction": pred_class_name, "probability": max_prob.item()}
            result = predict(image_tensor)
            keepF.append(result)
        max_probability_result = max(keepF, key=lambda x: x["probability"])
        predictresult.append(max_probability_result)
        uploads_types(contents,  "frontbumper" , bucket_name, folder, file.filename)
    else:
        print(1)

    if filesR:
        for file in filesR:
            contents = await file.read()
            image = Image.open(BytesIO(contents)).convert("RGB")
            image = image.resize((224, 224))

            image_tensor = transform(image).unsqueeze(0)  
            def predict(image_tensor):
                with torch.no_grad():
                    input_img = Variable(image_tensor)
                    output = model_rearbumper(input_img)

                    softmax = nn.Softmax(dim=1)
                    probabilities = softmax(output)
                    max_prob, predicted_class = torch.max(probabilities, 1)
                    pred_class_name = classes[predicted_class.item()]
                return {"prediction": pred_class_name, "probability": max_prob.item()}
            result = predict(image_tensor)
            keepR.append(result)
        max_probability_result = max(keepR, key=lambda x: x["probability"])
        predictresult.append(max_probability_result)
        uploads_types(contents,  "rearbumper" , bucket_name, folder, file.filename)

    else: 
        print(2)
    if filesD:
        for file in filesD:
            contents = await file.read()
            image = Image.open(BytesIO(contents)).convert("RGB")
            image = image.resize((224, 224))

            image_tensor = transform(image).unsqueeze(0)  
            def predict(image_tensor):
                with torch.no_grad():
                    input_img = Variable(image_tensor)
                    output = model_door(input_img)

                    softmax = nn.Softmax(dim=1)
                    probabilities = softmax(output)
                    max_prob, predicted_class = torch.max(probabilities, 1)
                    pred_class_name = classes[predicted_class.item()]
                return {"prediction": pred_class_name, "probability": max_prob.item()}
            result = predict(image_tensor)      
            keepD.append(result)  
        max_probability_result = max(keepD, key=lambda x: x["probability"])
        predictresult.append(max_probability_result)
        uploads_types(contents,  "door" , bucket_name, folder, file.filename)
    else:
        print(3)

    if filesB:
        for file in filesB:
            contents = await file.read()
            image = Image.open(BytesIO(contents)).convert("RGB")
            image = image.resize((224, 224))

            image_tensor = transform(image).unsqueeze(0)  
            def predict(image_tensor):
                with torch.no_grad():
                    input_img = Variable(image_tensor)
                    output = model_headlight(input_img)

                    softmax = nn.Softmax(dim=1)
                    probabilities = softmax(output)
                    max_prob, predicted_class = torch.max(probabilities, 1)
                    pred_class_name = classes[predicted_class.item()]
                return {"prediction": pred_class_name, "probability": max_prob.item()}
            result = predict(image_tensor)
            keepB.append(result)
        max_probability_result = max(keepB, key=lambda x: x["probability"])
        predictresult.append(max_probability_result)
        uploads_types(contents,  "headlight" , bucket_name, folder, file.filename)
    else:
        print(4)

    if filesE:
        for file in filesE:
            contents = await file.read()
            image = Image.open(BytesIO(contents)).convert("RGB")
            image = image.resize((224, 224))

            image_tensor = transform(image).unsqueeze(0)  
            def predict(image_tensor):
                with torch.no_grad():
                    input_img = Variable(image_tensor)
                    output = model_taillight(input_img)

                    softmax = nn.Softmax(dim=1)
                    probabilities = softmax(output)
                    max_prob, predicted_class = torch.max(probabilities, 1)
                    pred_class_name = classes[predicted_class.item()]
                return {"prediction": pred_class_name, "probability": max_prob.item()}
            result = predict(image_tensor)        
            keepE.append(result)
        max_probability_result = max(keepE, key=lambda x: x["probability"])
        predictresult.append(max_probability_result)
        uploads_types(contents,  "taillight" , bucket_name, folder, file.filename)
    else:
        print(5)

    result_max = max(predictresult, key=lambda x: x["probability"])
    rounded_probability = round(result_max['probability'] * 100, 2)
    db = client.carpartdata
    col = db.car
    model = result_max['prediction']
    brand, name, year = model.split(" ")
    filters = {"car_image": 1}

    carimage = col.find_one({"name": name, "brand": brand, "year": int(year)}, filters)
    print(carimage)
    response_data = {
        "prediction": result_max['prediction'],
        "probability": rounded_probability,
        "car_image": carimage['car_image']
    }
    


    return JSONResponse(response_data)
    



@app.get("/carpartsearch")
async def carpart(name: str, brand: str, year: int):
    db = client.carpartdata
    filters = {"frontbumper_list": 1, "rearbumper_list": 1, "grille_list": 1,
               "headlamp_list": 1, "backuplamp_list": 1, "mirror_list": 1, "door_list": 1}
    documents = db.car.find_one(
        {"name": name, "brand": brand, "year": year}, filters)
    frontbumper_data = db.frontbumper.find(
        {"_id": {"$in": documents['frontbumper_list']}})
    rearbumper_data = db.rearbumper.find(
        {"_id": {"$in": documents['rearbumper_list']}})
    grille_data = db.grille.find(
        {"_id": {"$in": documents['grille_list']}})
    door_data = db.door.find(
        {"_id": {"$in": documents['door_list']}})
    mirror_data = db.mirror.find(
        {"_id": {"$in": documents['mirror_list']}})
    headlamp_data = db.headlamp.find(
        {"_id": {"$in": documents['headlamp_list']}})
    backuplamp_data = db.backuplamp.find(
        {"_id": {"$in": documents['backuplamp_list']}})

    response_data = {
        "frontbumper": list(frontbumper_data),
        "rearbumper": list(rearbumper_data),
        "grille": list(grille_data),
        "door": list(door_data),
        "mirror": list(mirror_data),
        "headlamp": list(headlamp_data),
        "backuplamp": list(backuplamp_data),
    }
    return JSONResponse(response_data)



class billdata(BaseModel):
    combinedLists: object
    price: float
    carname: str
    token :str

@app.post("/saveresult")
async def carpart(billdata : billdata):
    now = datetime.now() 
    date_time = now.strftime("%m/%d/%Y")
    txt = billdata.carname + ' ' + '(' + date_time + ')'
    db = client.carpartdata
    coluser = db.user
    colbill = db.bill
    user = verify_token(billdata.token)
    getdatauser = coluser.find_one(
        {"email": user['email']}
    )
    latest_doc = colbill.aggregate([
        {"$sort": {"_id": -1}},
        {"$limit": 1}
    ])

    latest_doc = next(latest_doc, None)

    if latest_doc is not None:
        latest_id = latest_doc['_id'] + 1
    else:
        latest_id = 1  
    rounded_num = round(billdata.price, 2)
    data_dict = {
        "_id" : latest_id,
        "car_name":txt,
        "carparts_list": billdata.combinedLists,
        "total_price" : rounded_num,
    }
    coluser.update_one({"_id":getdatauser["_id"] }  ,{'$push': {"bill_list": latest_id}})
    colbill.insert_one(data_dict)
    



        # s3 = boto3.client('s3', aws_access_key_id='***', aws_secret_access_key='***')
        # # Download the model file from S3
        # obj = s3.get_object(Bucket='carimageapp', Key='**/ไฟลโมเดล')
        # buffer = io.BytesIO(obj['Body'].read())
        # model = models.resnet50()
        # model_state_dict = torch.load(buffer, map_location='cpu')
        # model.load_state_dict(model_state_dict)
        # Load the model
