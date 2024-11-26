 ~~~   
    _____                                                 _                        _
   /  ____ \             sskk4                           | |                      | |   __
   | |__  | |   _    _    _    _  _       __   _     __  | |     ___      ____    | |  / /
   | __|  | |  | |  | |  | |  | |/   \   /  _\/ |   / _ \/ |    / _ \    //\  \   | |_/ /
   | |    | |  | |  | |  | |  |  /\  |  / /  |  |  / /  |  |   / /_\ \  //  \  \  |  _  \
   | |    | |  | |  | |  | |  | /  | | | /   |  | | /   |  |  |  ___ / ||    \  \/  |  \ \
   | |    | |_/   \/  |_/  |__| |  | |/  \ __|  |/  \__ |  |_/   \_____/ ___/       |   | \__/\
  _| |    \____/\___  __/\____/_|  |___/\____   _/\_____/\____/\_______/\_______/|__|    \____/
/  /              /  /                      /  /
\_/               \_/                       \_/
~~~   


# FILE STRUCTURE 

< flying-desk-backend

	< office-service/src/...
		> cloud
		> config
		> controller
		> dto
		> exception
		> model
		> repository
		> seed
		> service
		# OfficeServiceApplication.java

        < security-service/src/...
		> config
		> controller
		> email
		> exception
		> model
		> repository
		> security
		> service
		> util
		# SecurityServiceApplication.java 

	< rent-service/src/...
		> config
		> controller
		> dto
		> exception
		> model
		> repository
		> service
		# RentServiceApplication.java


< flying-desk-frontend/src

	< assets
		> icons
		> images

	< components
		> FiltresBar
		> Footer
		> Form
		> Header
		> Pagination
		> SearchBar
		> SideBar

	< pages 
 		> Auth
		> Office
		> Profile

	> routes
	> services
	> styles
	< utils
		> test-components


# DEPEDENCIES 

Backend 

	- build.gradle 
		
	:spring-boot-starter-data-jpa
	:spring-boot-starter-security
	:spring-boot-starter-web
	:spring-boot-devtools
	:lombok
	:mysql-connector
	:springdoc-openai-starter-webmvc
	:mapstruct
	:jjwt-api
	:jjwt-impl
	:jjwt-jackson
	:google-cloud-storage
	:spring-boot-starter-mail


Frontend
	
	- import 

	from "react"
	from "react-router-dom"
	from "sweetalert2"
	from "axios"


# API 

Backend

rent-service #todo rent-service
http://localhost:8082

office_service

http://localhost:8081/api/v1
		
	POST	/address

	GET	/address/{id}
	PUT	
	DELETE	


	GET	/building
	POST

	GET	/building/{id}
	PUT
	DELETE


	GET	/city   #todo get /city
	POST

	GET	/city/{id}
	DELETE


	GET	/country   #todo get /country
	POST

	GET	/country/{id}
	DELETE


	GET	/desk
	POST

	GET	/desk/{id}
	PUT
	DELETE


	GET	/room
	POST

	GET	/room/{id}
	PUT
	DELETE

http://localhost:8081/photos/

	POST	/upload

	GET	/{folderName}/{fileName}
	DELETE
	
	
security-service

http://localhost:8080/api/v1/auth

	POST	/register
	
	POST	/authenticate

	GET	/logout

	POST	/refresh

	POST	/pw/change

	PUT	/set-role/{userId}

	POST	/pw/recovery
	
	POST	/pw/recovery/{token}

	GET	/activate/{token}

	GET	/check-email/{email}


http://localhost:8080/api/v1/demo

	GET	/admin/dashboard


Frontend

http://localhost:3000

		/

		/login
		/register
		/profile
		
		/add/office
		/office/id
		

					
# DATABASE 

mysql://localhost:3306/flying_desk_rent

	rents
		id
		date_start
		date_end
		payment_id
		user_id
		table_id

	payments
		id
		price
		user_id
		rent_id


mysql://localhost:3306/flying_desk_office

	country
		id
		country

	city
		id
		city
		country_id

	address
		id
		address
		city_id
		country_id

	building
		id
		building
		descrption
		address_id
		photo_url

	room	
		id
		equpiment	enum( #todo )
		building_id

	desk
		id
		eupiment	enum( #todo )
		room_id


mysql://localhost:3306/flying_desk_user

	user
		id
		firstname
		lastname
		email
		role		enum( 'ADMIN', 'USER', #todo 'OWNER' 'CUSTOMER')
		is_active

	refresh_token
		id
		token
		created
		expired
		user_id
		


