import java.util.Scanner;

public class Palindrome {
    public static void main(String args[]) {
        String input;
        String inp = "";
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the string you want to check:");
        input = sc.nextLine();
        int n = input.length();
        
        for(int i = n - 1; i >= 0; i--) {
            inp = inp + input.charAt(i);
        }
        
        if(input.equalsIgnoreCase(inp)) {
            System.out.println("The string is palindrome.");
        }
        
        else {
            System.out.println("The string is not palindrome.");
        }
        sc.close();
    }
}