#include<iostream>
using namespace std;

int main() {
	int x, limit;
	cout<<"Enter the number of items:"<<"\n";
	cin>>limit;
	int *arr = new int(limit);
	cout << "Enter " << limit << " numbers:" << endl;
	for (x = 0; x < limit; x++) {
		cin >> arr[x];
	}
	cout << "Entered numbers are: ";
	for (x = 0; x < limit; x++) {
		cout << arr[x] << " ";
	}
	return 0;
}
