# Documentation For DankBank's Websocket

## Basic Layout

All messages are sent as JSON encoded in UTF-8.
The JSON will follow the following structure:

   ```json
[WEBSOCKET PACKET]

	{
		"type": <string Type>,
		"data": <* Data>
	}
```

Think of the "type" as a function name and "data" as the parameters sent to the function
the data parameter can be anything, but is most commonly a JSON object.

## Basic Authentication

Before the server sends the client any data (except for certain "Global" packets), the server will require an authentication message from the client.

The authentication message looks like the following

   ```json
  [WEBSOCKET PACKET]

 {
      "type": "authenticate",
      "data": {
         "uuid": <string UUID>
      }
   }
  ```

The UUID element should be the account token. This can be recieved by your app by sending a GET request to : `http://desktopapi.dankbank.io/authenticate`.

The GET request must pass the following query parameters:
- `username`: The username of the client *(ex. SoLoDas*)
- `password`: The password of the client *(ex. ABC123)*

An example request would look like:
```url
http://desktopapi.dankbank.io/authenticate?username=SoLoDas&password=ABC123
```

If sucsessfull, the response will be the account token.
If unsucsessfull, the response will be an empty string

## openURL packet
a specific packet, with type `openURL` will be sent when the server requires the client to open a website. This is currently (and for the forseeable future, only) used when requiring the OAuth url to open. An example packet is displayed below

```json
[WEBSOCKET PACKET]

   {
      "type": "openURL",
      "data": <string URL>
   }
  ```
this should prompt the client to open the URL in `data`

## batchMemedata packet
the 	`batchMemedata` packet is sent with an array of exactly 40 elements. These elements are JSON bodies that are identical to the response recieved with reddit's JSON api.

```json
[WEBSOCKET PACKET]

   {
      "type": "batchMemedata",
      "data": [
         <object redditPost>,
         ...
      ]
   }
  ```

```json
[redditPost]

{  
	"approved_at_utc":null,  
	"subreddit":"MemeEconomy",  
	"selftext":"",  
	"user_reports":[  
	  
	],  
	"saved":false,  
	"mod_reason_title":null,  
	"gilded":0,  
	"clicked":false,  
	"title":"Don't get blocked by a pillar! Invest now!",  
	"link_flair_richtext":[  
	  
	],  
	"subreddit_name_prefixed":"r/MemeEconomy",  
	"hidden":false,  
	"pwls":6,  
	"link_flair_css_class":null,  
	"downs":0,  
	"thumbnail_height":106,  
	"parent_whitelist_status":"all_ads",  
	"hide_score":false,  
	"name":"t3_c64av8",  
	"quarantine":false,  
	"link_flair_text_color":"dark",  
	"upvote_ratio":0.88,  
	"author_flair_background_color":null,  
	"subreddit_type":"public",  
	"ups":51,  
	"total_awards_received":0,  
	"media_embed":{  
	  
	},  
	"thumbnail_width":140,  
	"author_flair_template_id":null,  
	"is_original_content":false,  
	"author_fullname":"t2_3eziw572",  
	"secure_media":null,  
	"is_reddit_media_domain":true,  
	"is_meta":false,  
	"category":null,  
	"secure_media_embed":{  
	  
	},  
	"link_flair_text":null,  
	"can_mod_post":false,  
	"score":51,  
	"approved_by":null,  
	"thumbnail":"https://b.thumbs.redditmedia.com/i4uwB1QfjBjiiCCW2be_QXJae0XQfG9edXxIyAg_ris.jpg",  
	"edited":false,  
	"author_flair_css_class":null,  
	"author_flair_richtext":[  
	  
	],  
	"gildings":{  
	  
	},  
	"post_hint":"image",  
	"content_categories":null,  
	"is_self":false,  
	"mod_note":null,  
	"created":1561663203.0,  
	"link_flair_type":"text",  
	"wls":6,  
	"banned_by":null,  
	"author_flair_type":"text",  
	"domain":"i.redd.it",  
	"selftext_html":null,  
	"likes":null,  
	"suggested_sort":null,  
	"banned_at_utc":null,  
	"view_count":null,  
	"archived":false,  
	"no_follow":false,  
	"is_crosspostable":false,  
	"pinned":false,  
	"over_18":false,  
	"preview":{  
	"images":[  
		{  
			"source":{  
				"url":"https://preview.redd.it/nfiyhf0cvv631.jpg?auto=webp&amp;s=4feb5a6361147f5cce903de73d1221f9bbe80db2",  
				"width":750,  
				"height":571  
			},  
			"resolutions":[  
				{	  
					"url":"https://preview.redd.it/nfiyhf0cvv631.jpg?width=108&amp;crop=smart&amp;auto=webp&amp;s=983194bdc6a2ad5d60f15975319af891a7a03030",  
					"width":108,  
					"height":82  
				},  
				{  
					"url":"https://preview.redd.it/nfiyhf0cvv631.jpg?width=216&amp;crop=smart&amp;auto=webp&amp;s=7a8069aae861857670454dde0b726a2f6548bd90",  
					"width":216,  
					"height":164  
				},  
				{  
					"url":"https://preview.redd.it/nfiyhf0cvv631.jpg?	width=320&amp;crop=smart&amp;auto=webp&amp;s=98ce5f5ac26c45c9a5f105c6efa73e517f1f344b",  
					"width":320,  
					"height":243  
				},  
				{  
					"url":"https://preview.redd.it/nfiyhf0cvv631.jpg?width=640&amp;crop=smart&amp;auto=webp&amp;s=681d77ea9782dd0fba1f144ab012b800b8d965ea",  
					"width":640,  
					"height":487  
				}  
			],  
			"variants":{  
		  
			},  
			"id":"EguAYkEgU3DFGrwi2H5dR45ORbjGMMMiy5aEnJ_7FZo"  
		}  
	],  
	"enabled":true  
	},  
	"all_awardings":[  
	  
	],  
	"media":null,  
	"media_only":false,  
	"can_gild":false,  
	"spoiler":false,  
	"locked":false,  
	"author_flair_text":null,  
	"visited":false,  
	"num_reports":null,  
	"distinguished":null,  
	"subreddit_id":"t5_3gl3k",  
	"mod_reason_by":null,  
	"removal_reason":null,  
	"link_flair_background_color":"",  
	"id":"c64av8",  
	"is_robot_indexable":true,  
	"report_reasons":null,  
	"author":"BeetleDJ",  
	"num_crossposts":0,  
	"num_comments":13,  
	"send_replies":true,  
	"contest_mode":false,  
	"author_patreon_flair":false,  
	"author_flair_text_color":null,  
	"permalink":"/r/MemeEconomy/comments/c64av8/dont_get_blocked_by_a_pillar_invest_now/",  
	"whitelist_status":"all_ads",  
	"stickied":false,  
	"url":"https://i.redd.it/nfiyhf0cvv631.jpg",  
	"subreddit_subscribers":1017438,  
	"created_utc":1561634403.0,  
	"mod_reports":[  
	  
	],  
	"is_video":false  
}
  ```

## update Packet
The update packet is a huge array of small objects. These small objects just list the id of an reddit post and new data about it.

```json
[WEBSOCKET PACKET]

   {
      "type": "update",
      "data": [
         <object updateObject>
         ...
      ]
   }
  ```

```json
[updateObject]

{
	"id": <string ID>,
	"newScore": <int score>,
	"newComment": <int numberOfComments>
}
  ```
  Please note that the `newComment`integer will only be sent if the number of comments changes. The `newScore` integer will *always* be sent however, allowing for the update packet to update charts

## batchSelfData Packet
The `batchSelfData` packet is information about the user, from reddit, memeeonomy profile, and thier firm.

```json
[WEBSOCKET PACKET]

   {
      "type": "batchSelfData",
      "data": {
		  "firm": <object Firm>,
		  "memeec": <object memeeconomyProfile>,
		  "reddit": <object redditProfile>
      }
   }
  ```

```json
[Firm]

{
	"assocs":  6,
	"balance":  6143367788892,
	"ceo":  "ivaskuu",
	"cfo":  "The_supply",
	"coo":  "hans91399",
	"execs":  6,
	"id":  104,
	"last_payout":  1561154402,
	"name":  "DankBank",
	"private":  true,
	"rank":  3,
	"size":  31,
	"tax":  13
}
  ```

```json
[memeeconomyProfile]

{
	"badges":  [],
	"balance":  42980,
	"broke":  0,
	"completed":  73,
	"firm":  104,
	"firm_role":  "",
	"id":  89768,
	"name":  "SoLoDas",
	"networth":  42980,
	"rank":  2926
}
  ```
```json
[redditProfile]

{
   "is_employee": false,
   "seen_layout_switch": true,
   "has_visited_new_profile": true,
   "pref_no_profanity": true,
   "has_external_account": false,
   "pref_geopopular": "US",
   "seen_redesign_modal": true,
   "pref_show_trending": true,
   "subreddit": {
      "default_set": true,
      "user_is_contributor": false,
      "banner_img": "",
      "disable_contributor_requests": false,
      "user_is_banned": false,
      "free_form_reports": true,
      "community_icon": "",
      "show_media": true,
      "icon_color": "#FF585B",
      "user_is_muted": false,
      "display_name": "u_SoLoDas",
      "header_img": null,
      "title": "bot boy",
      "over_18": false,
      "icon_size": [
         256,
         256
      ],
      "primary_color": "",
      "icon_img": "https://www.redditstatic.com/avatars/avatar_default_12_FF585B.png",
      "description": "",
      "header_size": null,
      "restrict_posting": true,
      "restrict_commenting": false,
      "subscribers": 55,
      "is_default_icon": true,
      "link_flair_position": "",
      "display_name_prefixed": "u/SoLoDas",
      "key_color": "",
      "name": "t5_4f9nc",
      "is_default_banner": true,
      "url": "/user/SoLoDas/",
      "banner_size": null,
      "user_is_moderator": true,
      "public_description": "hi, i'm u/SoLoDas\nI'm both a bot and a human! I try to manage crossposts so the OP knows who is crossposting their work.\n",
      "link_flair_enabled": false,
      "subreddit_type": "user",
      "user_is_subscriber": false
   },
   "is_sponsor": false,
   "gold_expiration": null,
   "has_gold_subscription": false,
   "num_friends": 1,
   "features": {
      "chat_subreddit": true,
      "show_amp_link": true,
      "read_from_pref_service": true,
      "chat_rollout": true,
      "chat": true,
      "chat_reddar_reports": true,
      "default_srs_holdout": {
         "owner": "relevance",
         "variant": "popular",
         "experiment_id": 171
      },
      "is_email_permission_required": false,
      "richtext_previews": true,
      "chat_subreddit_notification_ftux": true,
      "email_verification": {
         "owner": "growth",
         "variant": "control_1",
         "experiment_id": 1038
      },
      "mweb_xpromo_revamp_v3": {
         "owner": "growth",
         "variant": "treatment_2",
         "experiment_id": 480
      },
      "mweb_xpromo_revamp_v2": {
         "owner": "growth",
         "variant": "treatment_2",
         "experiment_id": 457
      },
      "webhook_config": true,
      "mweb_xpromo_modal_listing_click_daily_dismissible_ios": true,
      "live_orangereds": true,
      "dual_write_user_prefs": true,
      "show_nps_survey": true,
      "do_not_track": true,
      "chat_user_settings": true,
      "mweb_xpromo_interstitial_comments_ios": true,
      "community_awards": true,
      "mweb_xpromo_modal_listing_click_daily_dismissible_android": true,
      "mweb_xpromo_interstitial_comments_android": true,
      "mweb_nsfw_xpromo": {
         "owner": "growth",
         "variant": "treatment_1",
         "experiment_id": 361
      },
      "mweb_sharing_web_share_api": {
         "owner": "growth",
         "variant": "control_1",
         "experiment_id": 314
      },
      "chat_group_rollout": true,
      "custom_feeds": true,
      "spez_modal": true,
      "mweb_link_tab": {
         "owner": "growth",
         "variant": "control_2",
         "experiment_id": 404
      }
   },
   "has_android_subscription": false,
   "verified": true,
   "pref_autoplay": true,
   "coins": 0,
   "has_paypal_subscription": false,
   "has_subscribed_to_premium": false,
   "id": "mwr38c7",
   "has_stripe_subscription": false,
   "seen_premium_adblock_modal": false,
   "can_create_subreddit": true,
   "over_18": true,
   "is_gold": false,
   "is_mod": true,
   "suspension_expiration_utc": null,
   "has_verified_email": true,
   "is_suspended": false,
   "pref_video_autoplay": true,
   "in_redesign_beta": true,
   "icon_img": "https://www.redditstatic.com/avatars/avatar_default_12_FF585B.png",
   "pref_nightmode": true,
   "oauth_client_id": "s05eekpXEMDenA",
   "hide_from_robots": false,
   "link_karma": 28607,
   "force_password_reset": false,
   "inbox_count": 18,
   "pref_top_karma_subreddits": true,
   "pref_show_snoovatar": false,
   "name": "SoLoDas",
   "pref_clickgadget": 5,
   "created": 1512287151,
   "gold_creddits": 0,
   "created_utc": 1512258351,
   "has_ios_subscription": false,
   "pref_show_twitter": false,
   "in_beta": true,
   "comment_karma": 11715,
   "has_subscribed": true,
   "seen_subreddit_chat_ftux": true
}
```

## batchInvestments packet

```json
[WEBSOCKET PACKET]

   {
      "type": "batchInvestments",
      "data": [
	      <object memeeconomyInvestment>
	      ...
      ]
   }
  ```

```json
[memeeconomyInvestment]

{
  "id": 359296,
  "post": "c6allb",
  "upvotes": 5,
  "comment": "es7bj0k",
  "name": "SoLoDas",
  "amount": 26088,
  "time": 1561667580,
  "done": true,
  "response": "es7bjt9",
  "final_upvotes": 222,
  "success": true,
  "profit": 19417,
  "firm_tax": 13,
  "completed": true
}
  ```


## batchFirmUsers packet

```json
[WEBSOCKET PACKET]

   {
      "type": "batchFirmUsers",
      "data": [
	      <object memeeconomyProfile>
	      ...
      ]
   }
  ```

Please note that the memeeconomyProfile object sent in this request specifically, does not include the `rank` nor the `net worth` elements.

## submission packet
The submission packet is a **global** packet. It does not require authentication to recieve.
```json
[WEBSOCKET PACKET]

   {
      "type": "submission",
      "data": <object redditPost>
   }
  ```
----
# Requested packets

Some data can not be recieved other than by directly requesting it. These requests look like the following

## Client ---> Server

```json
{
	"type": <string requestType>
	"data": {
		"uuid": <string UUIDv4>,
		...
	}
}
```

## Server ---> Client
```json
{
	"type": "responseTo:" + <string UUIDv4>,
	"data": <* Data>
}
```

## Example request

### Client ---> Server
```json
{
	"type": "getUpvoteHistory", 
	"data": {
		"uuid": "596c35de-ba4d-4391-a4ee-73bb63614e44", 
		"id": "c6e3hg"
	}
}
```
### Server ---> Client (response)
```json
{
	"type": "responseTo:596c35de-ba4d-4391-a4ee-73bb63614e44",
	"data": ...
}
```

## Types of requests.

## getUpvoteHistory
The `getUpvtoteHistory` packet requires a `id` element sent in `data`. the `id` should be the reddit post id excluding the type.

Request Example:
```json
{
	"type": "getUpvoteHistory", 
	"data": {
		"uuid": <string UUIDv4>, 
		"id": <string postID>
	}
}
```

Response Example:
```json
{
	"type": "responseTo:" + <string UUIDv4>,
	"data": {
		"current": <object redditPost>,
		"time": <array[int] timeArray>,
		"values": <array[int] valueArray>
	}
}
```

```json
[timeArray]

[
	<int [javascript's Date.now();]>,
	...
]
```
```json
[valueArray]

[
	<int score>
	...
]
```
The number of elements in timeArray and valueArray will always be the same.
The intended use is to chart the time array on the x-axis and the valueArray on the y-axis

## getFirmList
The `getFirmList` packet does not require any extra data
Request Example:
```json
{
	"type": "getFirmList", 
	"data": {
		"uuid": <string UUIDv4>
	}
}
```

Response Example:
```json
{
	"type": "responseTo:" + <string UUIDv4>,
	"data": [
		<object Firm>
		...
	]
}
```

## getUser
The `getUser` packet requires a `id` element sent in `data`. the `id` should be the name of the user.

Request Example:
```json
{
	"type": "getUser", 
	"data": {
		"uuid": <string UUIDv4>, 
		"id": <string username>
	}
}
```

Response Example:
```json
{
	"type": "responseTo:" + <string UUIDv4>,
	"data": {
		"reddit": <object redditProfile>,
		"memeec": <object memeeconomyProfile>,
		"firm": <object Firm>,
		"investments": [
		    <object memeeconomyInvestment>
		    ...
	    ]
	}
}
```

## investMeme
The `investMeme` packet requires a `id` element sent in `data`. the `id` should be the name of the user.
The `investMeme` packet requires a `investAmount` element sent in `data`. the `investAmount` should be the amount (%) to invest. *(ex. 50 for 50%)*
The `investMeme` packet requires a `platform` element sent in `data`. the `platform` should be the platform the investment is on. *(ex. "Windows" for "invested with DankBank for Windows")*


Request Example:
```json
{
	"type": "investMeme", 
	"data": {
		"uuid": <string UUIDv4>, 
		"id": <string postID>, 
		"investmentAmount": <int investmentPrecent>, 
		"platform": <string platform>
	}
}
```

Response Example:
```json
{
	"type": "responseTo:" + <string UUIDv4>,
	"data": {}
}
```

## joinFirm
The `joinFirm` packet requires a `id` element sent in `data`. the `id` should be the name of the firm.
The `joinFirm` packet requires a `platform` element sent in `data`. the `platform` should be the platform the investment is on. *(ex. "Windows" for "invested with DankBank for Windows")*


Request Example:
```json
{
	"type": "joinFirm", 
	"data": {
		"uuid": <string UUIDv4>, 
		"id": <string firmName>, 
		"platform": <string platform>
	}
}
```

Response Example:
```json
{
	"type": "responseTo:" + <string UUIDv4>,
	"data": {}
}
```

## leaveFirm
The `leaveFirm` packet requires a `platform` element sent in `data`. the `platform` should be the platform the investment is on. *(ex. "Windows" for "invested with DankBank for Windows")*


Request Example:
```json
{
	"type": "leaveFirm", 
	"data": {
		"uuid": <string UUIDv4>,
		"platform": <string platform>
	}
}
```

Response Example:
```json
{
	"type": "responseTo:" + <string UUIDv4>,
	"data": {}
}
```
## kickUser
The `kickUser` packet requires a `id` element sent in `data`. the `id` should be the name of the user to kick.
The `kickUser` packet requires a `platform` element sent in `data`. the `platform` should be the platform the investment is on. *(ex. "Windows" for "invested with DankBank for Windows")*


Request Example:
```json
{
	"type": "kickUser", 
	"data": {
		"uuid": <string UUIDv4>, 
		"id": <string username>,
		"platform": <string platform>
	}
}
```

Response Example:
```json
{
	"type": "responseTo:" + <string UUIDv4>,
	"data": {}
}
```
## promoteUser
The `promoteUser` packet requires a `id` element sent in `data`. the `id` should be the name of the user to promote.
The `promoteUser` packet requires a `platform` element sent in `data`. the `platform` should be the platform the investment is on. *(ex. "Windows" for "invested with DankBank for Windows")*


Request Example:
```json
{
	"type": "promoteUser", 
	"data": {
		"uuid": <string UUIDv4>,
		"id": <string username>,
		"platform": <string platform>
	}
}
```

Response Example:
```json
{
	"type": "responseTo:" + <string UUIDv4>,
	"data": {}
}
```

## demoteUser
The `demoteUser` packet requires a `id` element sent in `data`. the `id` should be the name of the user to demote
The `demoteUser` packet requires a `platform` element sent in `data`. the `platform` should be the platform the investment is on. *(ex. "Windows" for "invested with DankBank for Windows")*


Request Example:
```json
{
	"type": "demoteUser", 
	"data": {
		"uuid": <string UUIDv4>,
		"id": <string username>,
		"platform": <string platform>
	}
}
```

Response Example:
```json
{
	"type": "responseTo:" + <string UUIDv4>,
	"data": {}
}
```