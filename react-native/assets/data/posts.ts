const posts = [
    {
      id: 1,
      name: 'Ultimate Pepperoni',
      created_at: '2024-01-01T00:00:00.000Z',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/peperoni.png',
      username: 'yujia',
      description: 'hello hello',
      likes: ['bob','joohee','sally'],
      comments: [
        { username: 'joohee', text: 'Great post!' },
        { username: 'alyssa', text: 'Nice picture!' }
      ]
    },
    {
      id: 2,
      name: 'ExtravaganZZa',
      created_at: '2024-05-30T00:00:00.000Z',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/extravaganzza.png',
      username: 'bob',
      description: 'hello hello',
      likes: ['bob','joohee','sally'],
      comments: [
        { username: 'joohee', text: 'Great post!' }
      ]
    },
    {
      id: 3,
      name: 'MeatZZa',
      created_at: '2024-05-30T01:00:00.000Z',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/peperoni.png',
      username: 'joohee',
      description: 'hello hello',
      likes: [],
      comments: [
        { username: 'joohee', text: 'Great post!' },
        { username: 'alyssa', text: 'Nice picture!' },
        { username: 'alyssa', text: 'Nice picture!' },
        { username: 'alyssa', text: 'Nice picture!' }
      ]
    },
    {
      id: 4,
      name: 'Margarita',
      created_at: '2024-05-30T01:20:00.000Z',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/margarita.png',
      username: 'bob',
      description: 'hello hello',
      likes: [],
      comments: []
    },
    {
      id: 5,
      name: 'Pacific Veggie',
      created_at: '2022-05-30T01:20:00.000Z',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/veggie.png',
      username: 'joohee',
      description: 'hello hello',
      likes: [],
      comments: [
        { username: 'joohee', text: 'Great post!' },
        { username: 'alyssa', text: 'Nice picture!' }
      ]
    },
    {
      id: 6,
      name: 'Hawaiian',
      created_at: '2022-05-30T01:20:00.000Z',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/hawaiin.png',
      username: 'sally',
      description: 'hello hello',
      likes: [],
      comments: [
        { username: 'joohee', text: 'Great post!' },
        { username: 'alyssa', text: 'Nice picture!' }
      ]
    },
    {
      id: 7,
      name: 'Deluxe',
      created_at: '2024-05-30T01:20:00.000Z',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/deluxe.png',
      username: 'yujia',
      description: 'hello hello',
      likes: [],
      comments: [
        { username: 'joohee', text: 'Great post!' },
        { username: 'alyssa', text: 'Nice picture!' }
      ]
    },
    {
      id: 8,
      name: 'BBQ Chicken',
      created_at: '2024-05-29T01:20:00.000Z',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/veggie.png',
      username: 'alyssa',
      description: 'hello hello',
      likes: [],
      comments: [
        { username: 'joohee', text: 'Great post!' },
        { username: 'alyssa', text: 'Nice picture!' }
      ]
    },
    {
      id: 9,
      name: 'Chicken Bacon Ranch',
      created_at: '2024-05-29T01:20:00.000Z',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/extravaganzza.png',
      username: 'alyssa',
      description: 'hello hello',
      likes: [],
      comments: []
    },
    {
      id: 10,
      name: '6 Cheese',
      created_at: '2024-05-29T01:20:00.000Z',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/6cheese.png',
      username: 'bob',
      description: 'hello hello',
      likes: [],
      comments: [
        { username: 'joohee', text: 'Great post!' },
        { username: 'alyssa', text: 'Nice picture!' }
      ]
    },
  ];
  
  export default posts;
  