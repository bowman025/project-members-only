require('dotenv').config();
const { argv } = require('node:process');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const SQL = `
  DROP TABLE IF EXISTS users, messages CASCADE;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    membership_status BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE 
  );
`;

const users = [
  {
    first_name: 'Isaac',
    last_name: 'Asimov',
    username: 'IA',
    membership: true,
    messages: [
      { title: 'On Ignorance',
        text: "There is a cult of ignorance in the United States, and there has always been. The strain of anti-intellectualism has been a constant thread winding its way through our political and cultural life, nurtured by the false notion that democracy means that 'my ignorance is just as good as your knowledge.'",
      },
      { title: 'On Atheism',
        text: "I am an atheist, out and out. It took me a long time to say it. I've been an atheist for years and years, but somehow I felt it was intellectually unrespectable to say one was an atheist, because it assumed knowledge that one didn't have. Somehow, it was better to say one was a humanist or an agnostic. I finally decided that I'm a creature of emotion as well as of reason. Emotionally, I am an atheist. I don't have the evidence to prove that God doesn't exist, but I so strongly suspect he doesn't that I don't want to waste my time."
      }
    ]
  },
  {
    first_name: 'Carl',
    last_name: 'Sagan',
    username: 'CS',
    membership: true,
    messages: [
      { title: 'On Earth',
        text: "Look again at that dot. That's here. That's home. That's us. On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives. The aggregate of our joy and suffering, thousands of confident religions, ideologies, and economic doctrines, every hunter and forager, every hero and coward, every creator and destroyer of civilization, every king and peasant, every young couple in love, every mother and father, hopeful child, inventor and explorer, every teacher of morals, every corrupt politician, every 'superstar,' every 'supreme leader,' every saint and sinner in the history of our species lived there-on a mote of dust suspended in a sunbeam.",
      },
      { title: 'On Books',
        text: 'A book is made from a tree. It is an assemblage of flat, flexible parts (still called "leaves") imprinted with dark pigmented squiggles. One glance at it and you hear the voice of another person, perhaps someone dead for thousands of years. Across the millennia, the author is speaking, clearly and silently, inside your head, directly to you. Writing is perhaps the greatest of human inventions, binding together people, citizens of distant epochs, who never knew one another. Books break the shackles of time ― proof that humans can work magic.'
      }
    ]
  },
  {
    first_name: 'Arthur C.',
    last_name: 'Clarke',
    username: 'ACC',
    membership: true,
    messages: [
      { title: 'On Morality and Religion', 
        text: "One of the great tragedies of mankind is that morality has been hijacked by religion. So now people assume that religion and morality have a necessary connection. But the basis of morality is really very simple and doesn't require religion at all.",
      },
      { title: '2001', 
        text: "Behind every man now alive stand thirty ghosts, for that is the ratio by which the dead outnumber the living. Since the dawn of time, roughly a hundred billion human beings have walked the planet Earth. Now this is an interesting number, for by a curious coincidence there are approximately a hundred billion stars in our local universe, the Milky Way. So for every man who has ever lived, in this Universe there shines a star. But every one of those stars is a sun, often far more brilliant and glorious than the small, nearby star we call the Sun. And many--perhaps most--of those alien suns have planets circling them. So almost certainly there is enough land in the sky to give every member of the human species, back to the first ape-man, his own private, world-sized heaven--or hell. How many of those potential heavens and hells are now inhabited, and by what manner of creatures, we have no way of guessing; the very nearest is a million times farther away than Mars or Venus, those still remote goals of the next generation. But the barriers of distance are crumbling; one day we shall meet our equals, or our masters, among the stars. Men have been slow to face this prospect; some still hope that it may never become reality. Increasing numbers, however are asking; 'Why have such meetings not occurred already, since we ourselves are about to venture into space?' Why not, indeed? Here is one possible answer to that very reasonable question. But please remember: this is only a work of fiction. The truth, as always, will be far stranger."
      }
    ]
  },
  { 
    first_name: 'Philip K.',
    last_name: 'Dick',
    username: 'PKD',
    membership: true,
    messages: [
      { title: 'On Reality', 
        text: "Today we live in a society in which spurious realities are manufactured by the media, by governments, by big corporations, by religious groups, political groups... So I ask, in my writing, What is real? Because unceasingly we are bombarded with pseudo-realities manufactured by very sophisticated people using very sophisticated electronic mechanisms. I do not distrust their motives; I distrust their power. They have a lot of it. And it is an astonishing power: that of creating whole universes, universes of the mind. I ought to know. I do the same thing.",
      },
      { title: 'On Reality 2', 
        text: "Maybe each human being lives in a unique world, a private world different from those inhabited and experienced by all other humans. . . If reality differs from person to person, can we speak of reality singular, or shouldn't we really be talking about plural realities? And if there are plural realities, are some more true (more real) than others? What about the world of a schizophrenic? Maybe it's as real as our world. Maybe we cannot say that we are in touch with reality and he is not, but should instead say, His reality is so different from ours that he can't explain his to us, and we can't explain ours to him. The problem, then, is that if subjective worlds are experienced too differently, there occurs a breakdown in communication ... and there is the real illness."
      }
    ]
  },
];

const connectionString = argv[2] || process.env.DATABASE_URL;
const client = new Client({ 
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function seed() {
  try {
    await client.connect();
    await client.query("SET client_encoding TO 'UTF8'");
    await client.query('BEGIN');
    console.log('Seeding started...');
    await client.query(SQL);
    console.log('Tables created.');

    const plainPw = process.env.SEED_USER_PASSWORD || 'fallback_dev_pass';
    const hashedPw = await bcrypt.hash(plainPw, 10);

    for (const user of users) {
      const userRes = await client.query(`
        INSERT INTO users (first_name, last_name, username, password, membership_status) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `, [user.first_name, user.last_name, user.username, hashedPw, user.membership]
      );
      const userId = userRes.rows[0].id;

      for (const msg of user.messages) {
        await client.query(`
          INSERT INTO messages (title, text, user_id)
          VALUES ($1, $2, $3)
        `, [msg.title, msg.text, userId]);
      }
    }

    await client.query('COMMIT');
    console.log('Seeding completed successfully.');
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }
    console.error('Seeding failed. Rolling back: ', error);
  } finally {
    client.end();
  }
}

seed();