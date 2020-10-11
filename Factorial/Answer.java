package forLoop;
import java.util.*;

public class Factorial {
	public static void main(String[] args) {
		
		Scanner sc = new Scanner(System.in);
		int n = sc.nextInt();
		int a = 0;
		int b=1;
		int f= 0;
		System.out.println(a + " ");
		System.out.println(b + " ");
		
		for(int i=0; i<n-2; i++) {
			
			System.out.println(f= a + b);
			a=b;
			b=f;
		}
		
		
		
	}

}
