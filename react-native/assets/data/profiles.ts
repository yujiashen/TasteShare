const profiles = [
  {
  username: 'yujia',
  profileImage: 'https://example.com/profile.jpg',
  followers: ['bob', 'joo'],
  following: ['alyssa','joohee'],
  requested: ['bob'],
  blocked: ['sally'],
  likes: [
    {
      id: 1,
      title: 'The Last of Us',
      category: 'movie',
      timestamp: '2024-01-08 04:05:06',
      coverImage: 'https://upload.wikimexdia.org/wikipedia/en/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg',
      rating: 5,
    },
    {
      id: 2,
      title: 'Pop 2 by Charli XCX',
      category: 'album',
      timestamp: '2024-01-09 04:05:06',
      coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/Charli_XCX_-_Pop_2.png/220px-Charli_XCX_-_Pop_2.png',
      rating: 5,
    }
  ]
  },
  {
    username: 'alyssa',
    profileImage: 'https://example.com/profile2.jpg',
    followers: ['yujia', 'joohee', 'bob'],
    following: ['joohee', 'bob'],
    likes: [
      {
        id: 3,
        title: 'Breaking Bad',
        category: 'show',
        timestamp: '2024-01-10 12:30:00',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/6/61/Breaking_Bad_title_card.png',
        rating: 5,
      },
      {
        id: 4,
        title: 'To Kill a Mockingbird',
        category: 'book',
        timestamp: '2024-01-11 14:00:00',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/7/79/To_Kill_a_Mockingbird.JPG',
        rating: 5,
      }
    ]
  },
  {
    username: 'joohee',
    profileImage: 'https://example.com/profile3.jpg',
    followers: ['alyssa', 'bob', 'sally'],
    following: [],
    likes: [
      {
        id: 5,
        title: 'Inception',
        category: 'movie',
        timestamp: '2024-01-12 18:00:00',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg',
        rating: 4,
      },
      {
        id: 6,
        title: '1989 by Taylor Swift',
        category: 'album',
        timestamp: '2024-01-13 10:00:00',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png',
        rating: 5,
      }
    ]
  },
  {
    username: 'bob',
    profileImage: 'https://example.com/profile4.jpg',
    followers: ['yujia', 'alyssa'],
    following: ['yujia', 'sally'],
    likes: [
      {
        id: 7,
        title: 'Game of Thrones',
        category: 'show',
        timestamp: '2024-01-14 20:00:00',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/d/d8/Game_of_Thrones_title_card.jpg',
        rating: 4,
      },
      {
        id: 8,
        title: 'Harry Potter and the Sorcerer\'s Stone',
        category: 'book',
        timestamp: '2024-01-15 15:00:00',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Harry_Potter_and_the_Sorcerer%27s_Stone.jpg',
        rating: 5,
      }
    ]
  },
  {
    username: 'sally',
    profileImage: 'https://example.com/profile5.jpg',
    followers: ['joohee', 'bob'],
    following: ['yujia', 'alyssa'],
    likes: [
      {
        id: 9,
        title: 'Interstellar',
        category: 'movie',
        timestamp: '2024-01-16 22:00:00',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
        rating: 5,
      },
      {
        id: 10,
        title: 'Fearless by Taylor Swift',
        category: 'album',
        timestamp: '2024-01-17 09:00:00',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Taylor_Swift_-_Fearless.png',
        rating: 4,
      }
    ]
  }
];

export default profiles;
