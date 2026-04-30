"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/lib/supabase/client";
import React, { useContext, useEffect, useState } from "react";

function Provider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CreateNewUser();
  }, []);

  // Commented out old code
  // const CreateNewUser = () => {
  //   supabase.auth.getUser().then(async ({ data: { user } }) => {
  //     if (!user) return; // If no user, do nothing

  //     //Check if user already exist
  //     let { data: Users, error } = await supabase
  //       .from("Users")
  //       .select("*")
  //       .eq("email", user?.email);

  //     if (error) {
  //       console.error("Error fetching user:", error);
  //       return;
  //     }

  //     console.log(Users);
  //     //If not then create new user
  //     if (!Users || Users.length === 0) {
  //       const { data, error: insertError } = await supabase
  //         .from("Users")
  //         .insert([
  //           {
  //             name: user?.user_metadata?.name,
  //             email: user?.email,
  //             picture: user?.user_metadata?.picture,
  //           },
  //         ]);
  //       if (insertError) {
  //         console.error("Error inserting user:", insertError);
  //         return;
  //       }
  //       console.log(data);
  //       setUser(data?.[0]); // data is array, take first element
  //       return;
  //     }
  //     setUser(Users[0]);
  //   });
  // };

  const getCurrentUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.user ?? null;
  };

  const CreateNewUser = async () => {
    try {
      const user = await getCurrentUser();

      if (!user) {
        setLoading(false);
        return; // If no user, do nothing
      }

      // Check if user already exists
      let { data: Users, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", user?.email);

      if (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
        return;
      }

      console.log(Users);
      // If not then create new user
      if (!Users || Users.length === 0) {
        const { data, error: insertError } = await supabase
          .from("Users")
          .insert([
            {
              name: user?.user_metadata?.name,
              email: user?.email,
              picture: user?.user_metadata?.picture,
            },
          ]);
        if (insertError) {
          console.error("Error inserting user:", insertError);
          setLoading(false);
          return;
        }
        console.log(data);
        setUser(data?.[0]); // data is array, take first element
        setLoading(false);
        return;
      }
      setUser(Users[0]);
      setLoading(false);
    } catch (err) {
      console.error("Network or unexpected error in CreateNewUser:", err);
      setLoading(false);
    }
  };

  return (
    <UserDetailContext.Provider value={{ user, loading, setUser }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  const context = useContext(UserDetailContext);
  return context;
};
