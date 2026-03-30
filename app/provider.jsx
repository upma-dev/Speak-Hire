"use Client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";

function Provider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CreateNewUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          await fetch("/api/auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ event, session }),
          });
        } catch (err) {
          console.error("auth state sync error:", err);
        }

        if (session?.user) {
          await CreateNewUser();
        } else {
          setUser(null);
        }
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
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
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        // AuthSessionMissingError is normal for unauthenticated visitors, ignore
        if (sessionError.name !== "AuthSessionMissingError") {
          console.error("Supabase session error:", sessionError);
        }
        return null;
      }

      return session?.user ?? null;
    } catch (err) {
      console.error("Error checking auth session:", err);
      return null;
    }
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
