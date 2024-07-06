import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { connectToDatabase, setupDatabaseTable, loadDataIntoDatabase } from '@database/dbConnect';

export default function Index() {
  const router = useRouter();
  const navigation = useNavigation();
  const tableName = 'moviesShows';
  const dataFilePath = 'assets/data/movies_shows_top50k.json';
  const [db, setDb] = useState(null);

  useEffect(() => {
    // REROUTED
    navigation.setOptions({ headerShown: false });
    router.replace('/(auth)/sign-in');
    //

    const connectAndSetupDatabase = async () => {
      try {
        const { db, connected } = await connectToDatabase();
        // setDb(db);
        if (connected) {
          console.log('DB CONNECTED?',db);
          await setupDatabaseTable(db, tableName);
          console.log('setupDatabaseTable');
          await loadDataIntoDatabase(db, tableName);
          console.log('loadDataIntoDatabase');
          // await db.closeAsync(); // Disconnect from the database
          // console.log('CLOSED');
          // add a line to disconnect from the databaase
        }
      } catch (error) {
        console.error('Database setup failed:', error);
      }
    };

    connectAndSetupDatabase();
    }, [router, navigation]);

  //   // Load data into the database after successful setup
  //   const loadDataIntoDatabaseInBackground = async () => {
  //     if (db) {
  //       await loadDataIntoDatabase(db, tableName, dataFilePath);
  //       setLoading(false);
  //     }
  //   };
  //   if (db) {
  //     loadDataIntoDatabaseInBackground();
  //   }
  // }, [router, navigation, db]);

  // if (loading) {
  //   return null;
  // }

  // return <Text>Loading...</Text>;
}

