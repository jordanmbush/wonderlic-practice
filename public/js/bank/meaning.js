/* Question bank: sentence and proverb meaning (similar / contradictory / neither, and interpretation). */
(function () {
  var STEM = 'Do these two sentences have similar meanings, contradictory meanings, or neither?';
  var S = 0, C = 1, N = 2;

  function pair(s1, s2, a, e, d) {
    return { q: STEM + '<br><i>1. ' + s1 + '<br>2. ' + s2 + '</i>', c: ['Similar', 'Contradictory', 'Neither'], a: a, e: e, d: d, fixed: true };
  }
  function same(saying, c, a, e, d) {
    return { q: 'Which saying means most nearly the same as <i>“' + saying + '”</i>?', c: c, a: a, e: e, d: d };
  }
  function means(saying, c, a, e, d) {
    return { q: 'What does this saying mean? <i>“' + saying + '”</i>', c: c, a: a, e: e, d: d };
  }

  QB.add('meaning', [
    // ---- Proverb pairs: contradictory ----
    pair('Look before you leap.', 'He who hesitates is lost.', C, '“Look before you leap” says to think carefully before acting; “he who hesitates is lost” says waiting too long costs you. They give opposite advice.', 2),
    pair('Many hands make light work.', 'Too many cooks spoil the broth.', C, 'The first says more helpers make a job easier; the second says too many people working on one thing ruin it. They disagree about whether more help is better.', 2),
    pair('Birds of a feather flock together.', 'Opposites attract.', C, 'The first says people are drawn to others like themselves; the second says people are drawn to those who are different. They make opposite claims.', 1),
    pair('Absence makes the heart grow fonder.', 'Out of sight, out of mind.', C, 'The first says being apart makes you care more; the second says being apart makes you forget. Opposite effects of the same situation.', 2),
    pair('Clothes make the man.', 'Don’t judge a book by its cover.', C, '“Clothes make the man” says outward appearance matters a lot in how a person is judged; “don’t judge a book by its cover” says appearance should not decide what you think. They take opposite sides.', 3),
    pair('You’re never too old to learn.', 'You can’t teach an old dog new tricks.', C, 'The first says anyone can learn at any age; the second says older people can’t learn new ways. Direct opposites.', 1),
    pair('Better safe than sorry.', 'Nothing ventured, nothing gained.', C, '“Better safe than sorry” advises avoiding risk; “nothing ventured, nothing gained” says you must take risks to get anything. Opposite advice about risk.', 2),
    pair('Silence is golden.', 'The squeaky wheel gets the grease.', C, '“Silence is golden” praises keeping quiet; “the squeaky wheel gets the grease” says the people who speak up (complain) get results. Opposite views on speaking up.', 3),
    pair('Two heads are better than one.', 'If you want something done right, do it yourself.', C, 'The first says working with someone else gives a better result; the second says you get the best result working alone. They disagree.', 3),
    pair('The best things in life are free.', 'You get what you pay for.', C, 'The first says the most valuable things cost nothing; the second says quality depends on how much you pay. They disagree about whether value comes from price.', 3),
    pair('Knowledge is power.', 'Ignorance is bliss.', C, '“Knowledge is power” says knowing more is an advantage; “ignorance is bliss” says not knowing can make you happier. Opposite views on knowing things.', 2),
    pair('Good things come to those who wait.', 'Strike while the iron is hot.', C, 'The first rewards patience; the second says act quickly while the chance is there. Opposite advice about timing.', 2),
    pair('Fortune favors the bold.', 'Discretion is the better part of valor.', C, '“Fortune favors the bold” says daring risk-takers succeed; “discretion is the better part of valor” says being careful is wiser than being daring. Opposite advice.', 3),
    pair('Honesty is the best policy.', 'What they don’t know won’t hurt them.', C, 'The first says always tell the truth; the second says hiding the truth is fine. They contradict each other.', 2),

    // ---- Proverb pairs: similar ----
    pair('Strike while the iron is hot.', 'Make hay while the sun shines.', S, 'Both say to act while conditions are favorable, before the chance passes.', 1),
    pair('The early bird catches the worm.', 'First come, first served.', S, 'Both say those who arrive or act first get the reward.', 1),
    pair('Actions speak louder than words.', 'Talk is cheap.', S, 'Both say what people do matters more than what they say.', 1),
    pair('A penny saved is a penny earned.', 'Waste not, want not.', S, 'Both praise being careful with what you have: saving and not wasting keep you from going without.', 2),
    pair('Birds of a feather flock together.', 'A man is known by the company he keeps.', S, 'Both rest on the same idea: people spend time with others like themselves, so your friends reflect who you are.', 3),
    pair('A stitch in time saves nine.', 'An ounce of prevention is worth a pound of cure.', S, 'Both say fixing a small problem early saves a lot of trouble later.', 2),
    pair('Honesty is the best policy.', 'Cheaters never prosper.', S, 'Both say being honest pays off and dishonesty doesn’t.', 2),
    pair('Slow and steady wins the race.', 'Haste makes waste.', S, 'Both warn against rushing: patient, careful work gets better results than hurrying.', 2),
    pair('All that glitters is not gold.', 'Appearances can be deceiving.', S, 'Both say something can look good on the outside without really being valuable or true.', 1),
    pair('You reap what you sow.', 'What goes around comes around.', S, 'Both say your actions eventually come back to you, good or bad.', 1),
    pair('Don’t cry over spilled milk.', 'What’s done is done.', S, 'Both say not to dwell on something that already happened and can’t be changed.', 1),
    pair('Once bitten, twice shy.', 'A burnt child dreads the fire.', S, 'Both say a painful experience makes you more careful the next time.', 3),
    pair('Out of sight, out of mind.', 'Long absent, soon forgotten.', S, 'Both say that when someone or something is away, it is soon forgotten.', 2),
    pair('There’s no place like home.', 'East or west, home is best.', S, 'Both say home is better than anywhere else.', 1),

    // ---- Proverb pairs: neither ----
    pair('A rolling stone gathers no moss.', 'The pen is mightier than the sword.', N, 'The first is about staying on the move; the second says words are more powerful than force. They are about unrelated ideas.', 1),
    pair('Don’t count your chickens before they hatch.', 'Honesty is the best policy.', N, 'The first warns against counting on results before they happen; the second is about telling the truth. Unrelated topics.', 1),
    pair('Let sleeping dogs lie.', 'Every dog has its day.', N, 'Both mention dogs, but “let sleeping dogs lie” means don’t stir up old trouble, while “every dog has its day” means everyone gets a moment of success. Shared words don’t make shared meaning.', 2),
    pair('A bird in the hand is worth two in the bush.', 'The early bird catches the worm.', N, 'Both mention birds, but the first says keep what you already have rather than risk it for more; the second says act early to succeed. They neither agree nor conflict.', 3),
    pair('Rome wasn’t built in a day.', 'A picture is worth a thousand words.', N, 'The first says big things take time; the second says an image can explain more than words. Unrelated ideas.', 1),
    pair('When in Rome, do as the Romans do.', 'Curiosity killed the cat.', N, 'The first says to follow local customs; the second warns that being nosy can get you into trouble. Unrelated ideas.', 1),
    pair('Barking dogs seldom bite.', 'Necessity is the mother of invention.', N, 'The first says loud threats are rarely carried out; the second says need drives creativity. Unrelated ideas.', 2),
    pair('You can lead a horse to water, but you can’t make it drink.', 'Laughter is the best medicine.', N, 'The first says you can’t force someone to accept help; the second says humor makes you feel better. Unrelated ideas.', 1),
    pair('Still waters run deep.', 'Better late than never.', N, 'The first says quiet people may have hidden depth; the second says doing something late beats not doing it. Unrelated ideas.', 2),
    pair('Don’t bite the hand that feeds you.', 'Where there’s smoke, there’s fire.', N, 'The first says don’t turn on people who help you; the second says signs of trouble usually mean real trouble. Unrelated ideas.', 2),
    pair('Practice makes perfect.', 'Blood is thicker than water.', N, 'The first says repetition builds skill; the second says family bonds are strongest. Unrelated ideas.', 2),
    pair('Don’t look a gift horse in the mouth.', 'The grass is always greener on the other side of the fence.', N, 'The first says don’t find fault with a gift; the second says people think others have it better. Different ideas that neither agree nor conflict.', 2),
    pair('An apple a day keeps the doctor away.', 'All’s well that ends well.', N, 'The first is about healthy habits; the second says a good ending makes up for earlier problems. Unrelated ideas.', 1),
    pair('Beauty is in the eye of the beholder.', 'Beauty is only skin deep.', N, 'Both mention beauty, but the first says people judge beauty differently, while the second says good looks are only on the surface. Different points that don’t conflict.', 3),

    // ---- Ordinary sentence pairs ----
    pair('The meeting was postponed until next week.', 'The meeting will take place later than first planned.', S, '“Postponed” means moved to a later time, so both sentences say the meeting was pushed back.', 1),
    pair('Few people attended the concert.', 'The concert was poorly attended.', S, 'Both say only a small number of people came to the concert.', 1),
    pair('She rarely arrives late.', 'She is almost always on time.', S, '“Rarely late” and “almost always on time” describe the same habit in different words.', 2),
    pair('Not all birds can fly.', 'Some birds are unable to fly.', S, 'Saying “not all birds can fly” means at least some birds can’t, which is exactly what the second sentence says.', 3),
    pair('The test was harder than I expected.', 'I expected the test to be easier than it was.', S, 'Both say the test turned out more difficult than the speaker thought it would be; the second just flips the wording.', 2),
    pair('Every student passed the exam.', 'Some students failed the exam.', C, 'If every student passed, then no one failed. The two sentences cannot both be true.', 1),
    pair('The bridge is safe to cross.', 'Crossing the bridge is dangerous.', C, 'Safe and dangerous are opposites, so the sentences contradict each other.', 1),
    pair('He never forgets a face.', 'He often forgets faces.', C, '“Never forgets” and “often forgets” cannot both be true of the same person.', 1),
    pair('The package arrived ahead of schedule.', 'The package was delivered late.', C, 'Ahead of schedule means early, which is the opposite of late.', 1),
    pair('All of the cookies were eaten.', 'Some of the cookies were left over.', C, 'If all the cookies were eaten, none could be left over. The sentences cannot both be true.', 2),
    pair('The restaurant is always crowded.', 'The restaurant rarely has customers.', C, 'A place that is always crowded can’t also rarely have customers. The statements contradict each other.', 2),
    pair('The library closes at 8 p.m.', 'Many students study in the library.', N, 'One gives the closing time; the other says students study there. Both can be true, and neither restates the other.', 1),
    pair('It rained heavily on Tuesday.', 'The picnic was held on Saturday.', N, 'The rain and the picnic were on different days, so the sentences neither agree nor conflict.', 2),
    pair('Maria speaks three languages.', 'Maria has visited France.', N, 'Both are about Maria, but they state different facts that don’t support or contradict each other.', 2),
    pair('The car needs new tires.', 'Gas prices went up this month.', N, 'Both involve driving, but they are separate facts. Neither restates nor conflicts with the other.', 1),
    pair('All roses are flowers.', 'All flowers are roses.', N, 'Flipping the sentence changes its meaning, so they are not similar. They also don’t directly contradict each other; the second just makes a different (and much bigger) claim.', 3),

    // ---- Which saying means the same? ----
    same('Strike while the iron is hot', ['Look before you leap', 'Slow and steady wins the race', 'Make hay while the sun shines', 'A watched pot never boils', 'Rome wasn’t built in a day'], 2, 'Both mean act while conditions are good, before the opportunity passes. “Look before you leap” and “slow and steady” give the opposite advice.', 1),
    same('A stitch in time saves nine', ['An ounce of prevention is worth a pound of cure', 'Better late than never', 'Every cloud has a silver lining', 'Many hands make light work', 'Don’t cry over spilled milk'], 0, 'Both mean that dealing with a small problem early prevents a much bigger one later.', 2),
    same('Actions speak louder than words', ['The pen is mightier than the sword', 'Honesty is the best policy', 'Beauty is in the eye of the beholder', 'Talk is cheap', 'Curiosity killed the cat'], 3, 'Both mean what people do matters more than what they say. “The pen is mightier than the sword” actually ranks words above force, a different idea.', 2),
    same('Don’t cry over spilled milk', ['A penny saved is a penny earned', 'What’s done is done', 'Better safe than sorry', 'The early bird catches the worm', 'Don’t bite the hand that feeds you'], 1, 'Both mean don’t waste energy being upset about something that already happened and can’t be undone.', 1),
    same('You reap what you sow', ['Two wrongs don’t make a right', 'Every dog has its day', 'Actions speak louder than words', 'Better late than never', 'What goes around comes around'], 4, 'Both mean the results you get come from your own actions: good deeds bring good results and bad deeds bring bad ones.', 2),
    same('Haste makes waste', ['Strike while the iron is hot', 'Slow and steady wins the race', 'The early bird catches the worm', 'Time is money', 'He who hesitates is lost'], 1, 'Both warn that rushing leads to mistakes, while patient, careful effort succeeds. Every other choice encourages speed.', 2),
    same('Once bitten, twice shy', ['The early bird catches the worm', 'Every dog has its day', 'A burnt child dreads the fire', 'Barking dogs seldom bite', 'Curiosity killed the cat'], 2, 'Both mean that after a painful experience, a person becomes cautious about repeating it.', 3),
    same('A penny saved is a penny earned', ['Time is money', 'The best things in life are free', 'Easy come, easy go', 'Money talks', 'Waste not, want not'], 4, 'Both praise thrift: being careful with what you have is as good as gaining more. The other choices mention money or value but make different points.', 3),
    same('Two heads are better than one', ['Too many cooks spoil the broth', 'Many hands make light work', 'If you want something done right, do it yourself', 'Great minds think alike', 'Every man for himself'], 1, 'Both say working together gets better results than working alone. “Great minds think alike” is about smart people agreeing, not about teamwork helping.', 3),
    same('Don’t judge a book by its cover', ['Clothes make the man', 'A picture is worth a thousand words', 'All that glitters is not gold', 'Birds of a feather flock together', 'The pen is mightier than the sword'], 2, 'Both warn that the outside appearance of something can be misleading. “Clothes make the man” says the opposite.', 2),
    same('The early bird catches the worm', ['Better late than never', 'A bird in the hand is worth two in the bush', 'Good things come to those who wait', 'First come, first served', 'Every dog has its day'], 3, 'Both mean the people who show up or act first get the reward. Sharing the word “bird” doesn’t make a saying similar.', 1),
    same('Out of sight, out of mind', ['Absence makes the heart grow fonder', 'Long absent, soon forgotten', 'Home is where the heart is', 'Blood is thicker than water', 'Let sleeping dogs lie'], 1, 'Both mean that when someone is away, they are soon forgotten. “Absence makes the heart grow fonder” says the opposite.', 3),
    same('Look before you leap', ['He who hesitates is lost', 'Fortune favors the bold', 'Better safe than sorry', 'Strike while the iron is hot', 'Nothing ventured, nothing gained'], 2, 'Both advise caution: think about the risks before you act. The other choices all encourage quick or bold action.', 2),
    same('Beauty is only skin deep', ['Beauty is in the eye of the beholder', 'Appearances can be deceiving', 'An apple a day keeps the doctor away', 'Practice makes perfect', 'Clothes make the man'], 1, 'Both mean good looks are only on the surface and don’t show what someone is really like. “Beauty is in the eye of the beholder” means people have different tastes, a different idea.', 3),
    same('Every cloud has a silver lining', ['When it rains, it pours', 'Lightning never strikes twice in the same place', 'Look on the bright side', 'Misery loves company', 'Curiosity killed the cat'], 2, 'Both mean something good can be found even in a bad situation.', 1),

    // ---- What does this saying mean? ----
    means('Don’t put all your eggs in one basket.', ['Handle fragile things with care.', 'Don’t take on more work than you can carry.', 'Keep your belongings organized.', 'Don’t risk everything on a single plan; spread out your risk.', 'Don’t be greedy.'], 3, 'If the one basket falls, every egg breaks. The saying warns against depending entirely on one thing.', 1),
    means('The grass is always greener on the other side of the fence.', ['Hard work always leads to success.', 'People tend to think others have it better than they do.', 'Your neighbors are usually wealthier than you.', 'Things improve with time.', 'Taking care of your home pays off.'], 1, 'Other people’s situations often look better from a distance, even when they aren’t. The saying describes that feeling.', 1),
    means('Don’t look a gift horse in the mouth.', ['Inspect anything carefully before you buy it.', 'Don’t trust strangers who offer gifts.', 'Don’t find fault with something you were given for free.', 'Treat animals gently.', 'Only give gifts to people who deserve them.'], 2, 'People once checked a horse’s teeth to judge its age and value. The saying means don’t critically inspect a gift; just be grateful for it.', 3),
    means('Let sleeping dogs lie.', ['Everyone needs a good rest.', 'Don’t believe everything people tell you.', 'Lazy people rarely succeed.', 'Leave pets alone when they are tired.', 'Don’t stir up an old problem that is causing no trouble now.'], 4, 'Waking a sleeping dog could get you bitten. The saying means leave a quiet situation alone instead of bringing up old trouble.', 2),
    means('You can lead a horse to water, but you can’t make it drink.', ['You can give someone an opportunity, but you can’t force them to take it.', 'Animals know what is best for them.', 'Hard work is always rewarded.', 'Always bring enough water on a trip.', 'Leaders should go first.'], 0, 'You can bring the horse to the water (the opportunity), but drinking is its own choice. The same is true of people.', 1),
    means('Still waters run deep.', ['Calm people are usually boring.', 'Deep rivers are dangerous to swim in.', 'A quiet person may have deep thoughts or strong feelings.', 'Patience brings rewards.', 'Silence means agreement.'], 2, 'A calm surface can hide great depth. Likewise, a quiet person may think and feel far more than they show.', 3),
    means('People who live in glass houses shouldn’t throw stones.', ['Protect your property from damage.', 'Don’t criticize others for faults you have yourself.', 'Wealthy people should be careful with money.', 'Keep your private life private.', 'Honesty is always best.'], 1, 'If you throw stones, someone can throw them back and break your glass house. Don’t attack others for flaws you share.', 3),
    means('The squeaky wheel gets the grease.', ['Machines need regular upkeep.', 'Quiet workers are rewarded most.', 'Noise is a sign of poor quality.', 'The person who complains the loudest gets attention.', 'Small problems grow if ignored.'], 3, 'The wheel that squeaks is the one that gets oiled. Likewise, people who speak up or complain are the ones whose needs get handled.', 1),
    means('Too many cooks spoil the broth.', ['Simple meals are the best.', 'Experts should be trusted over beginners.', 'Large groups eat more food.', 'Hard work can ruin a good thing.', 'When too many people try to run one task, the result suffers.'], 4, 'When everyone adds their own ideas to one pot, the soup gets ruined. A job with too many people in charge turns out worse.', 1),
    means('Necessity is the mother of invention.', ['Mothers are the most inventive people.', 'When people truly need something, they find creative ways to get it.', 'Inventions always make life easier.', 'Only buy what you need.', 'Great ideas come from luck.'], 1, 'Need “gives birth” to new ideas: when people must solve a problem, they get creative.', 2),
    means('Barking dogs seldom bite.', ['Noisy pets need more training.', 'Angry people are dangerous.', 'People who make loud threats rarely carry them out.', 'Loud people make good leaders.', 'Warnings should always be taken seriously.'], 2, 'A dog that barks a lot is usually all noise. Likewise, people who make loud threats often don’t follow through.', 3),
    means('Don’t bite the hand that feeds you.', ['Be careful when feeding animals.', 'Only eat food you prepare yourself.', 'Share what you have with others.', 'Don’t depend on others for help.', 'Don’t turn against someone who helps or supports you.'], 4, 'An animal that bites the person feeding it hurts its own source of food. Don’t harm the people you depend on.', 1),
  ]);
})();
