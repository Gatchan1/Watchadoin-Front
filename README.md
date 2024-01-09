# PROJECT NAME - FRONT END

This is a fork of the final project of our web development bootcamp at Ironhack Barcelona. It's a MERN Stack application, check the backend repository [here](https://github.com/Gatchan1/watchadoin-back).
Watchadoin' is an event planner app. You will be able to know what your friends are up to and join in on their plans. If you can see a plan it means you are "invited" to attend.

## About us
Our names are Raquel Barrio, Camila Buldin and Lisa Schwetlick.

![Project Image](https://res.cloudinary.com/dqzjo5wsl/image/upload/v1694678259/watcha-front_hlawdu.png "Project Image")

## Deployment
You can check the app fully deployed [here](https://watchadoin.netlify.app/). If you wish to view the API deployment instead, check [here](https://watchadoin.fly.dev/).

## Work structure
We used [Discord](https://discord.com/) to organize our workflow.

## Future improvements
There are lots of missing features I'd like to include in the future, such as:

- Automatically hiding past events.
- Editing and deleting Friends Circles.
- Implement password retrieval.

## Installation guide
- Fork this repo
- Clone this repo 

```shell
$ cd project-front
$ npm install
$ npm start
```

## Routes
| Route                                     | Privacy         | Renders                  |
| ------------------------------------------| :-------------: | ------------------------ |
| /                                         | only logged out | SignupPage                 |
| /signup                                   | only logged out | SignupPage               |
| /login                                    | only logged out | LoginPage                |
| /logout                                   | private         | LogoutPage, it redirects to login |
| /calendar page                            | private         | CalendarPage            |
| /:username                        | private         | UserProfilePage with conditional rendering |
| /:username/edit                   | private         | EditProfilePage          |
| /:username/event/:eventId         | private         | EventDetailPage        |
| /*                                        | public          | ErrorPage                |



## Components
- Navbar
- ConfirmedEvents
- AvailableEvents
- EventDetail
- MyEvents
- InviteLists
- FriendsConfirmed
- FriendsPending
- CreateEvent
- EventUpdate
- ...
