# aimtrainer
Try it yourself here:
https://kottbullepizza.github.io/aimtrainer/

An aimtrainer/click-accuracy-trainer using the HTML Canvas-element for 2d-context rendering and Javascript for handling click-events and DOM-manipulation.

<img width="1919" height="1078" alt="image" src="https://github.com/user-attachments/assets/6074d681-cdf5-4def-a996-3e65d4b7437e" />

<h2>Target hitboxes</h2>
<p>
  As the HTML Canvas element doesn't allow adding click events to specific paths (shapes) on the canvas, I had to be a little clever about how to check whether a click was inside a target or not. I solved this by iterating through the array of target objects and comparing the mouse coordinates to the distance of each target object's center point, using Pythagoras theorem. If the distance between the click and the center is shorter than or equal to the target object's radius, the click is inside that target. This way, the hitbox of each target is perfectly circular, as well as the same size as the target itself.
</p>

<h2>User options</h2>
<p>
  The user has a wide range of options for practicing their click accuracy. First, they can select anywhere between 1 and 100 targets. Secondly, they can choose between 6 different sizes for the targets. Then the user can choose 10 different time periods for how long they want to play the game. And finally, the user can select whether they want the targets to disappear when clicked or moved to a different part of the screen. That gives the user a total of 12000 different ways to practice their click accuracy.
</p>


<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/dc3a8104-3648-4830-a028-34189cb90011" />

<h2>Scoreboard</h2>
<p>
  A very simple scoreboard is displayed when the clock runs out, showing the player's total number of targets hit and what their average click accuracy was. It also gives the user the options between playing again immediately and altering the settings.
</p>

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/c6542921-9490-45ac-91d8-eafa8120effc" />
