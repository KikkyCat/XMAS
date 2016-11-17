# XMAS
This is a small application created basically to learn some web technologies, hence is not big nor throughly tested.

The idea is to allow users to select a secret friend for the tradition Christmas gift exchange but you can use for whatever season you like :D.

# Technical aspects
The important part here is the JSON file, https://github.com/sosahvictor/XMAS/blob/master/resources/data/data.json, because it contains the list of persons that will be selected and will select secret friends. In this file you will notice the following:
* _availableAsSecretFriend_: This is where the persons that are still waiting to be assigned as secret friend.
* _availableToAssignSecretFriend_: This is where persons that haven't selected a secret friend are stored.
* _assigned_: Are the persons that have a secret friend. The person who originated the reques is stored in the _originator_ object, while the secret friend of such person is, well, _secretFriend_.
* _all_: This is the list of all friends in the pool, it's there just as an informative part for debug purposes (checking who's in the list to make sure all assignations are correct).

# Copyright
This application is licensed under Apache License V2. See the full license here
https://github.com/KikkyCat/XMAS/blob/master/License.txt
