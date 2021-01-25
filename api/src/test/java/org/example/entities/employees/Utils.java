package org.example.entities.employees;

import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
//import java.util.Random;
import java.util.Scanner;

final class Util {

    private static final int DEFAULT_PORT = 8080;

    private Util() {
    }

    static String inputStreamToString(InputStream is) {
        Scanner s = new Scanner(is).useDelimiter("\\A");
        return s.hasNext() ? s.next() : "";
    }

    static int getAvailablePort() {
        return 8080;
        /*
        return new Random()
                .ints(6000, 9000)
                .filter(Util::isFree)
                .findFirst()
                .orElse(DEFAULT_PORT);
                */
    }


    private static boolean isFree(int port) {
        try {
            new ServerSocket(port).close();
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}